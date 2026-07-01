
DO $$ BEGIN
  CREATE TYPE public.debt_category AS ENUM ('parcelada','variavel','fixa','congelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.debts
  ADD COLUMN IF NOT EXISTS category public.debt_category NOT NULL DEFAULT 'parcelada';

-- Backfill: mark variable debts as 'variavel'
UPDATE public.debts SET category = 'variavel' WHERE is_variable = true AND category = 'parcelada';

-- Revert one installment (bidirectional toggle for parcelada debts)
CREATE OR REPLACE FUNCTION public.revert_debt_payment(_debt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
DECLARE
  v_user uuid;
  v_inst numeric;
  v_cat public.debt_category;
BEGIN
  SELECT user_id, monthly_installment, category
    INTO v_user, v_inst, v_cat
    FROM public.debts WHERE id = _debt_id;
  IF v_user IS NULL OR v_user <> auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.debts
    SET remaining_installments = CASE WHEN v_cat = 'parcelada' THEN remaining_installments + 1 ELSE remaining_installments END,
        total_amount = CASE WHEN v_cat = 'parcelada' THEN total_amount + v_inst ELSE total_amount END,
        status_this_month = 'pendente',
        last_paid_month = NULL,
        updated_at = now()
  WHERE id = _debt_id;
END $fn$;

-- Pay debt with explicit amount (for variavel) — only marks paid + reduces parcelada installments; caller creates the transaction row via API to link account.
CREATE OR REPLACE FUNCTION public.pay_debt_with_amount(_debt_id uuid, _amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
DECLARE
  v_user uuid;
  v_cat public.debt_category;
  v_rem integer;
BEGIN
  SELECT user_id, category, remaining_installments
    INTO v_user, v_cat, v_rem
    FROM public.debts WHERE id = _debt_id;
  IF v_user IS NULL OR v_user <> auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.debts
    SET remaining_installments = CASE WHEN v_cat = 'parcelada' THEN GREATEST(v_rem - 1, 0) ELSE v_rem END,
        total_amount = GREATEST(total_amount - _amount, 0),
        monthly_installment = CASE WHEN v_cat = 'variavel' THEN _amount ELSE monthly_installment END,
        status_this_month = 'pago',
        last_paid_month = date_trunc('month', now())::date,
        updated_at = now()
  WHERE id = _debt_id;
END $fn$;
