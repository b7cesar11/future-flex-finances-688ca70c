
-- ============ FASE 14a: commitment_groups schema ============
-- Cria a entidade central para agrupar parcelamentos/empréstimos/refinanciamentos/recorrências.
-- Nesta fase apenas o schema + backfill dos parcelamentos existentes.
-- purchase_group_id continua presente por compatibilidade — será depreciado em 14c.

-- 1. Enum de tipos de compromisso
DO $$ BEGIN
  CREATE TYPE public.commitment_kind AS ENUM ('parcelamento', 'emprestimo', 'refinanciamento', 'recorrencia');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Tabela commitment_groups
CREATE TABLE IF NOT EXISTS public.commitment_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind public.commitment_kind NOT NULL,
  description text NOT NULL,
  category text,
  total_original numeric NOT NULL DEFAULT 0,
  installments_total integer,
  person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  credit_card_id uuid REFERENCES public.credit_cards(id) ON DELETE SET NULL,
  nome_cartao_terceiro text,
  first_due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.commitment_groups TO authenticated;
GRANT ALL ON public.commitment_groups TO service_role;

ALTER TABLE public.commitment_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own commitment_groups"
  ON public.commitment_groups
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER commitment_groups_set_updated_at
  BEFORE UPDATE ON public.commitment_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS commitment_groups_user_id_idx ON public.commitment_groups(user_id);
CREATE INDEX IF NOT EXISTS commitment_groups_person_id_idx ON public.commitment_groups(person_id);

-- 3. Coluna nova em transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS commitment_group_id uuid REFERENCES public.commitment_groups(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS transactions_commitment_group_id_idx
  ON public.transactions(commitment_group_id);

-- 4. Backfill: um commitment_group por purchase_group_id existente
WITH grupos AS (
  SELECT
    t.purchase_group_id AS pg,
    t.user_id,
    (array_agg(t.description ORDER BY t.installment_number NULLS LAST))[1] AS descricao,
    (array_agg(t.category ORDER BY t.installment_number NULLS LAST))[1] AS categoria,
    SUM(t.amount) AS total,
    MAX(t.installment_total) AS parcelas,
    (array_agg(t.person_id ORDER BY t.installment_number NULLS LAST) FILTER (WHERE t.person_id IS NOT NULL))[1] AS person_id,
    (array_agg(t.credit_card_id ORDER BY t.installment_number NULLS LAST) FILTER (WHERE t.credit_card_id IS NOT NULL))[1] AS credit_card_id,
    MIN(t.due_date) AS first_due
  FROM public.transactions t
  WHERE t.purchase_group_id IS NOT NULL
    AND t.commitment_group_id IS NULL
  GROUP BY t.purchase_group_id, t.user_id
),
inserted AS (
  INSERT INTO public.commitment_groups
    (id, user_id, kind, description, category, total_original, installments_total, person_id, credit_card_id, first_due_date)
  SELECT
    pg, user_id, 'parcelamento'::public.commitment_kind,
    regexp_replace(COALESCE(descricao, ''), '\s*\(\d+/\d+\)\s*$', ''),
    categoria, total, parcelas, person_id, credit_card_id, first_due
  FROM grupos
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
UPDATE public.transactions t
  SET commitment_group_id = t.purchase_group_id
WHERE t.purchase_group_id IS NOT NULL
  AND t.commitment_group_id IS NULL
  AND EXISTS (SELECT 1 FROM public.commitment_groups cg WHERE cg.id = t.purchase_group_id);

-- 5. Generaliza criar_compra_parcelada: também cria commitment_group e preenche commitment_group_id
CREATE OR REPLACE FUNCTION public.criar_compra_parcelada(
  _description text,
  _amount_total numeric,
  _installments integer,
  _first_due_date date,
  _category text,
  _credit_card_id uuid DEFAULT NULL::uuid,
  _account_id uuid DEFAULT NULL::uuid,
  _person_id uuid DEFAULT NULL::uuid,
  _envelope_id uuid DEFAULT NULL::uuid,
  _parcelas_ja_pagas integer DEFAULT 0
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_group uuid := gen_random_uuid();
  v_parcela numeric;
  v_ult numeric;
  v_due date;
  v_ref_month date;
  v_invoice uuid;
  v_ja_pagas integer := GREATEST(COALESCE(_parcelas_ja_pagas, 0), 0);
  i int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _installments < 1 THEN RAISE EXCEPTION 'installments must be >= 1'; END IF;
  IF _amount_total <= 0 THEN RAISE EXCEPTION 'amount must be positive'; END IF;
  IF v_ja_pagas >= _installments THEN
    RAISE EXCEPTION 'parcelas_ja_pagas deve ser menor que o total';
  END IF;

  v_parcela := round(_amount_total / _installments, 2);
  v_ult := _amount_total - (v_parcela * (_installments - 1));

  -- commitment_group central (id = v_group, mesmo valor usado como purchase_group_id p/ compat)
  INSERT INTO public.commitment_groups
    (id, user_id, kind, description, category, total_original,
     installments_total, person_id, credit_card_id, first_due_date)
  VALUES
    (v_group, v_user, 'parcelamento', _description, _category, _amount_total,
     _installments, _person_id, _credit_card_id, _first_due_date);

  FOR i IN 1.._installments LOOP
    v_due := (_first_due_date + ((i - 1) * INTERVAL '1 month'))::date;
    v_invoice := NULL;
    IF _credit_card_id IS NOT NULL AND i > v_ja_pagas THEN
      v_ref_month := date_trunc('month', v_due)::date;
      v_invoice := public.get_or_create_invoice(_credit_card_id, v_ref_month);
    END IF;

    INSERT INTO public.transactions (
      user_id, account_id, amount, type, category, description,
      date, due_date, status, is_fixed, paid_at,
      credit_card_id, invoice_id, purchase_group_id, commitment_group_id,
      installment_number, installment_total, person_id, envelope_id
    ) VALUES (
      v_user,
      CASE WHEN _credit_card_id IS NULL THEN _account_id ELSE NULL END,
      CASE WHEN i = _installments THEN v_ult ELSE v_parcela END,
      'despesa', _category,
      _description || ' (' || i || '/' || _installments || ')',
      v_due, v_due,
      CASE WHEN i <= v_ja_pagas THEN 'pago'::payment_status ELSE 'pendente'::payment_status END,
      false,
      CASE WHEN i <= v_ja_pagas THEN now() ELSE NULL END,
      _credit_card_id, v_invoice, v_group, v_group,
      i, _installments, _person_id, _envelope_id
    );
  END LOOP;

  RETURN v_group;
END $function$;
