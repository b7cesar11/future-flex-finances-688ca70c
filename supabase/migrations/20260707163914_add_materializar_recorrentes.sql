/*
# Add materializar_recorrentes function

1. New function: materializar_recorrentes
   - Purpose: For a given (user, year, month), finds all `is_fixed = true` transactions
     that belong to the user and creates copies for the target month if they don't already exist.
   - This enables the "Timeline universal" feature: recurring income and fixed expenses
     automatically appear in future months without manual entry.
   - Parameters: _year int, _month int (1-12)
   - Returns: integer (count of new transactions created)

2. How it works
   - Finds all `is_fixed = true` transactions for `auth.uid()`.
   - For each fixed transaction, computes the target due_date as:
     same day-of-month as the original, in the target year/month.
   - Checks if a transaction already exists for that (origin_transaction_id, target due_date).
     If yes, skips (idempotent).
   - If not, inserts a new transaction row:
     - Same amount, type, category, description, account_id, envelope_id, person_id, credit_card_id
     - date = target due_date, due_date = target due_date
     - status = 'pendente'
     - is_fixed = false (the copy is a concrete instance, not a template)
     - origin_transaction_id = original transaction's id
   - Returns the count of newly created rows.

3. Security
   - SECURITY DEFINER, runs as the calling user's context via auth.uid().
   - Only materializes transactions owned by the calling user.
   - Granted to `authenticated` only.

4. Important notes
   - Idempotent: calling it multiple times for the same month creates no duplicates.
   - Does NOT modify or delete existing transactions.
   - The original `is_fixed = true` row is the "template" — it stays unchanged.
   - Copies have `is_fixed = false` so they don't themselves get re-materialized.
*/

CREATE OR REPLACE FUNCTION public.materializar_recorrentes(_year int, _month int)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_count integer := 0;
  v_target_date date;
  v_orig record;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _month < 1 OR _month > 12 THEN RAISE EXCEPTION 'month must be 1-12'; END IF;

  FOR v_orig IN
    SELECT id, amount, type, category, description, account_id,
           envelope_id, person_id, credit_card_id,
           COALESCE(due_date, date) AS orig_date
    FROM transactions
    WHERE user_id = v_user
      AND is_fixed = true
      AND origin_transaction_id IS NULL
  LOOP
    -- Compute target date: same day-of-month in target year/month
    v_target_date := make_date(
      _year,
      _month,
      LEAST(EXTRACT(DAY FROM v_orig.orig_date)::int, 28)
    );

    -- Skip if a copy already exists for this (origin, target_date)
    IF EXISTS (
      SELECT 1 FROM transactions
      WHERE origin_transaction_id = v_orig.id
        AND due_date = v_target_date
        AND user_id = v_user
    ) THEN
      CONTINUE;
    END IF;

    INSERT INTO transactions (
      user_id, account_id, amount, type, category, description,
      date, due_date, status, is_fixed, paid_at,
      envelope_id, person_id, credit_card_id,
      origin_transaction_id
    ) VALUES (
      v_user, v_orig.account_id, v_orig.amount, v_orig.type,
      v_orig.category, v_orig.description,
      v_target_date, v_target_date, 'pendente', false, NULL,
      v_orig.envelope_id, v_orig.person_id, v_orig.credit_card_id,
      v_orig.id
    );

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END $function$;

REVOKE EXECUTE ON FUNCTION public.materializar_recorrentes(int, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.materializar_recorrentes(int, int) TO authenticated;