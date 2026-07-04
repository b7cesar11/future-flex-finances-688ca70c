
-- ============ PEOPLE ============
DO $$ BEGIN
  CREATE TYPE public.person_type AS ENUM ('contato', 'empresa', 'familia');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.people (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.person_type NOT NULL DEFAULT 'contato',
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.people TO authenticated;
GRANT ALL ON public.people TO service_role;

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own people" ON public.people
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER people_set_updated_at
  BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_people_user_id ON public.people(user_id);

-- ============ third_party_financials.person_id ============
ALTER TABLE public.third_party_financials
  ADD COLUMN IF NOT EXISTS person_id UUID REFERENCES public.people(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_third_party_person_id ON public.third_party_financials(person_id);

-- ============ BUDGET ENVELOPES ============
CREATE TABLE IF NOT EXISTS public.budget_envelopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  monthly_limit NUMERIC(14,2) NOT NULL DEFAULT 0,
  emoji TEXT DEFAULT '📦',
  color TEXT DEFAULT 'bg-primary/20 text-primary',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_envelopes TO authenticated;
GRANT ALL ON public.budget_envelopes TO service_role;

ALTER TABLE public.budget_envelopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own envelopes" ON public.budget_envelopes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER envelopes_set_updated_at
  BEFORE UPDATE ON public.budget_envelopes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_envelopes_user_id ON public.budget_envelopes(user_id);

-- ============ transactions.envelope_id ============
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS envelope_id UUID REFERENCES public.budget_envelopes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_envelope_id ON public.transactions(envelope_id);

-- ============ Update wipe_user_data ============
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
  DELETE FROM public.budget_envelopes WHERE user_id = v_user;
  DELETE FROM public.people WHERE user_id = v_user;
END $function$;
