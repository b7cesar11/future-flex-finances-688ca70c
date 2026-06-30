
-- ENUMS
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pago','pendente','atrasado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.third_party_type AS ENUM ('emprestei_dinheiro','usou_meu_cartao','devo_a_terceiro');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.income_status AS ENUM ('recebido','pendente');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- TRANSACTIONS additions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS due_date date,
  ADD COLUMN IF NOT EXISTS status public.payment_status NOT NULL DEFAULT 'pago',
  ADD COLUMN IF NOT EXISTS is_fixed boolean NOT NULL DEFAULT false;

-- DEBTS additions
ALTER TABLE public.debts
  ADD COLUMN IF NOT EXISTS is_variable boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status_this_month public.payment_status NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS last_paid_month date;

-- ACCOUNTS: initial balance for dynamic wallet calculation
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS initial_balance numeric NOT NULL DEFAULT 0;

-- THIRD PARTY
CREATE TABLE IF NOT EXISTS public.third_party_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  person_name text NOT NULL,
  type public.third_party_type NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  due_date date,
  is_installment boolean NOT NULL DEFAULT false,
  installments_left integer NOT NULL DEFAULT 1,
  status public.payment_status NOT NULL DEFAULT 'pendente',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.third_party_financials TO authenticated;
GRANT ALL ON public.third_party_financials TO service_role;
ALTER TABLE public.third_party_financials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own third_party all" ON public.third_party_financials
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER third_party_set_updated_at BEFORE UPDATE ON public.third_party_financials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- INCOME SOURCES
CREATE TABLE IF NOT EXISTS public.income_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  expected_day integer NOT NULL DEFAULT 5,
  expected_date_label text,
  amount numeric NOT NULL DEFAULT 0,
  status public.income_status NOT NULL DEFAULT 'pendente',
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  last_received_month date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.income_sources TO authenticated;
GRANT ALL ON public.income_sources TO service_role;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own income_sources all" ON public.income_sources
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER income_sources_set_updated_at BEFORE UPDATE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RPC: pay a debt installment -> reduces remaining + total_amount, marks status_this_month
CREATE OR REPLACE FUNCTION public.pay_debt_installment(_debt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid;
  v_inst numeric;
  v_rem integer;
BEGIN
  SELECT user_id, monthly_installment, remaining_installments
    INTO v_user, v_inst, v_rem
    FROM public.debts WHERE id = _debt_id;
  IF v_user IS NULL OR v_user <> auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.debts
    SET remaining_installments = GREATEST(v_rem - 1, 0),
        total_amount = GREATEST(total_amount - v_inst, 0),
        status_this_month = 'pago',
        last_paid_month = date_trunc('month', now())::date,
        updated_at = now()
  WHERE id = _debt_id;
END $$;

GRANT EXECUTE ON FUNCTION public.pay_debt_installment(uuid) TO authenticated;

-- RPC: wipe all user data (Danger Zone)
CREATE OR REPLACE FUNCTION public.wipe_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  DELETE FROM public.transactions WHERE user_id = v_user;
  DELETE FROM public.debts WHERE user_id = v_user;
  DELETE FROM public.third_party_financials WHERE user_id = v_user;
  DELETE FROM public.income_sources WHERE user_id = v_user;
  DELETE FROM public.savings_goals WHERE user_id = v_user;
  DELETE FROM public.investments WHERE user_id = v_user;
  DELETE FROM public.accounts WHERE user_id = v_user;
END $$;

GRANT EXECUTE ON FUNCTION public.wipe_user_data() TO authenticated;
