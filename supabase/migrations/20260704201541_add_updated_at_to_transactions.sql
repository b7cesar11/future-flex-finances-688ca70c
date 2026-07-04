-- Fix: transactions table was missing updated_at column, causing pagar_parcela
-- (and other RPCs) to fail with "column updated_at of relation transactions does not exist".
-- All other tables have updated_at + a set_updated_at trigger; transactions was the only one missing it.

ALTER TABLE public.transactions
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER transactions_set_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
