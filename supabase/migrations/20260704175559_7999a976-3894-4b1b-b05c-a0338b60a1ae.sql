ALTER TYPE public.commitment_kind ADD VALUE IF NOT EXISTS 'financiamento';

ALTER TABLE public.debts
  ADD COLUMN IF NOT EXISTS commitment_group_id uuid REFERENCES public.commitment_groups(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_debts_commitment_group_id ON public.debts(commitment_group_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.debts TO authenticated;
GRANT ALL ON public.debts TO service_role;

CREATE OR REPLACE FUNCTION public.criar_divida_compromisso(
  _name text,
  _debt_type public.debt_type,
  _monthly_installment numeric,
  _installments integer,
  _first_due_date date,
  _category public.debt_category DEFAULT 'parcelada'::public.debt_category
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_group uuid := gen_random_uuid();
  v_debt uuid;
  v_due date;
  v_kind public.commitment_kind;
  i int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _monthly_installment <= 0 THEN RAISE EXCEPTION 'monthly installment must be positive'; END IF;
  IF _installments < 1 AND _category <> 'fixa' THEN RAISE EXCEPTION 'installments must be >= 1'; END IF;

  v_kind := CASE
    WHEN _debt_type = 'Empréstimo'::public.debt_type THEN 'emprestimo'::public.commitment_kind
    WHEN _debt_type = 'Financiamento'::public.debt_type THEN 'financiamento'::public.commitment_kind
    ELSE 'parcelamento'::public.commitment_kind
  END;

  INSERT INTO public.commitment_groups
    (id, user_id, kind, description, category, total_original, installments_total, first_due_date)
  VALUES
    (v_group, v_user, v_kind, _name, _category::text, _monthly_installment * GREATEST(_installments, 1), GREATEST(_installments, 1), _first_due_date);

  INSERT INTO public.debts
    (user_id, name, type, total_amount, monthly_installment, remaining_installments,
     total_installments, due_day, start_date, is_variable, status_this_month, category, commitment_group_id)
  VALUES
    (v_user, _name, _debt_type, _monthly_installment * GREATEST(_installments, 1), _monthly_installment,
     CASE WHEN _category = 'fixa' THEN 0 ELSE _installments END,
     GREATEST(_installments, 1), EXTRACT(DAY FROM _first_due_date)::int, _first_due_date,
     _category = 'variavel', 'pendente', _category, v_group)
  RETURNING id INTO v_debt;

  IF _category <> 'fixa' THEN
    FOR i IN 1.._installments LOOP
      v_due := (_first_due_date + ((i - 1) * INTERVAL '1 month'))::date;
      INSERT INTO public.transactions (
        user_id, account_id, amount, type, category, description,
        date, due_date, status, is_fixed, paid_at,
        purchase_group_id, commitment_group_id, installment_number, installment_total
      ) VALUES (
        v_user, NULL, _monthly_installment, 'despesa', 'contas',
        _name || ' (' || i || '/' || _installments || ')',
        v_due, v_due, 'pendente', false, NULL,
        v_group, v_group, i, _installments
      );
    END LOOP;
  END IF;

  RETURN v_group;
END $function$;

REVOKE EXECUTE ON FUNCTION public.criar_divida_compromisso(text, public.debt_type, numeric, integer, date, public.debt_category) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.criar_divida_compromisso(text, public.debt_type, numeric, integer, date, public.debt_category) TO authenticated, service_role;