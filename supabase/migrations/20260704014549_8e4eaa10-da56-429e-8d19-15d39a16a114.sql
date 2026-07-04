
-- ==== ENUMS ====
DO $$ BEGIN
  CREATE TYPE public.invoice_status AS ENUM ('futura','aberta','fechada','paga');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.third_party_direction AS ENUM ('a_pagar','a_receber');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method_type AS ENUM ('conta','cartao_credito','dinheiro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ==== CREDIT_CARDS ====
CREATE TABLE IF NOT EXISTS public.credit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  closing_day int NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
  due_day int NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  credit_limit numeric,
  payment_account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_cards TO authenticated;
GRANT ALL ON public.credit_cards TO service_role;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user manages own cards" ON public.credit_cards;
CREATE POLICY "user manages own cards" ON public.credit_cards
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_credit_cards_updated ON public.credit_cards;
CREATE TRIGGER trg_credit_cards_updated BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==== CREDIT_CARD_INVOICES ====
CREATE TABLE IF NOT EXISTS public.credit_card_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  reference_month date NOT NULL,
  closing_date date NOT NULL,
  due_date date NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'futura',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (credit_card_id, reference_month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_card_invoices TO authenticated;
GRANT ALL ON public.credit_card_invoices TO service_role;
ALTER TABLE public.credit_card_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user manages own invoices" ON public.credit_card_invoices;
CREATE POLICY "user manages own invoices" ON public.credit_card_invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.credit_cards cc
            WHERE cc.id = credit_card_id AND cc.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.credit_cards cc
            WHERE cc.id = credit_card_id AND cc.user_id = auth.uid())
  );

DROP TRIGGER IF EXISTS trg_invoices_updated ON public.credit_card_invoices;
CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON public.credit_card_invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==== TRANSACTIONS extensions ====
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS credit_card_id uuid REFERENCES public.credit_cards(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invoice_id uuid REFERENCES public.credit_card_invoices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS purchase_group_id uuid,
  ADD COLUMN IF NOT EXISTS installment_number int,
  ADD COLUMN IF NOT EXISTS installment_total int,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_tx_purchase_group ON public.transactions(purchase_group_id);
CREATE INDEX IF NOT EXISTS idx_tx_invoice ON public.transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_tx_credit_card ON public.transactions(credit_card_id);

-- ==== THIRD_PARTY_FINANCIALS extensions ====
ALTER TABLE public.third_party_financials
  ADD COLUMN IF NOT EXISTS direction public.third_party_direction NOT NULL DEFAULT 'a_pagar',
  ADD COLUMN IF NOT EXISTS payment_method public.payment_method_type NOT NULL DEFAULT 'conta',
  ADD COLUMN IF NOT EXISTS credit_card_id uuid REFERENCES public.credit_cards(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS purchase_group_id uuid;

-- ==== SOFT DELETE ====
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- ==== FUNCTION: get_or_create_invoice ====
CREATE OR REPLACE FUNCTION public.get_or_create_invoice(
  _credit_card_id uuid,
  _reference_month date
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid;
  v_closing_day int;
  v_due_day int;
  v_ref_month date := date_trunc('month', _reference_month)::date;
  v_closing_date date;
  v_due_date date;
  v_invoice_id uuid;
  v_last_day int;
BEGIN
  SELECT user_id, closing_day, due_day
    INTO v_user, v_closing_day, v_due_day
    FROM public.credit_cards WHERE id = _credit_card_id;

  IF v_user IS NULL OR v_user <> auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT id INTO v_invoice_id
    FROM public.credit_card_invoices
    WHERE credit_card_id = _credit_card_id AND reference_month = v_ref_month;
  IF v_invoice_id IS NOT NULL THEN
    RETURN v_invoice_id;
  END IF;

  -- Compute closing_date (clamp to last day of month)
  v_last_day := EXTRACT(DAY FROM (v_ref_month + INTERVAL '1 month - 1 day'))::int;
  v_closing_date := v_ref_month + (LEAST(v_closing_day, v_last_day) - 1);

  -- Due date: if due_day >= closing_day, same month; else next month
  IF v_due_day >= v_closing_day THEN
    v_due_date := v_ref_month + (LEAST(v_due_day, v_last_day) - 1);
  ELSE
    v_due_date := (v_ref_month + INTERVAL '1 month')::date;
    v_last_day := EXTRACT(DAY FROM (v_due_date + INTERVAL '1 month - 1 day'))::int;
    v_due_date := v_due_date + (LEAST(v_due_day, v_last_day) - 1);
  END IF;

  INSERT INTO public.credit_card_invoices
    (credit_card_id, reference_month, closing_date, due_date, status)
    VALUES (_credit_card_id, v_ref_month, v_closing_date, v_due_date, 'futura')
    RETURNING id INTO v_invoice_id;

  RETURN v_invoice_id;
END $$;

REVOKE ALL ON FUNCTION public.get_or_create_invoice(uuid, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_or_create_invoice(uuid, date) TO authenticated;
