
ALTER TYPE public.payment_method_type ADD VALUE IF NOT EXISTS 'cartao_terceiro';

ALTER TABLE public.third_party_financials
  ADD COLUMN IF NOT EXISTS nome_cartao_terceiro text;

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
)
 RETURNS uuid
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

  FOR i IN 1.._installments LOOP
    v_due := (_first_due_date + ((i - 1) * INTERVAL '1 month'))::date;
    v_invoice := NULL;
    -- Só liga em fatura se for cartão próprio E a parcela NÃO for retroativa (já paga fora do sistema)
    IF _credit_card_id IS NOT NULL AND i > v_ja_pagas THEN
      v_ref_month := date_trunc('month', v_due)::date;
      v_invoice := public.get_or_create_invoice(_credit_card_id, v_ref_month);
    END IF;

    INSERT INTO public.transactions (
      user_id, account_id, amount, type, category, description,
      date, due_date, status, is_fixed, paid_at,
      credit_card_id, invoice_id, purchase_group_id,
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
      _credit_card_id, v_invoice, v_group,
      i, _installments, _person_id, _envelope_id
    );
  END LOOP;

  RETURN v_group;
END $function$;
