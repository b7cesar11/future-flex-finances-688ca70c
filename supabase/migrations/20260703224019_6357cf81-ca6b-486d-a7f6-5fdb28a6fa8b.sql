
ALTER TABLE public.savings_goals ADD COLUMN IF NOT EXISTS monthly_contribution NUMERIC NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.monthly_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year DATE NOT NULL,
  global_limit_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, month_year)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_budgets TO authenticated;
GRANT ALL ON public.monthly_budgets TO service_role;

ALTER TABLE public.monthly_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own monthly_budgets"
  ON public.monthly_budgets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_monthly_budgets_updated
  BEFORE UPDATE ON public.monthly_budgets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Also make sure wipe_user_data cleans budgets
CREATE OR REPLACE FUNCTION public.wipe_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  DELETE FROM public.monthly_budgets WHERE user_id = v_user;
END $function$;
