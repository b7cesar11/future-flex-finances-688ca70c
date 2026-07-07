/*
# Add frozen_at to commitment_groups + congelar/descongelar functions

1. Changes to existing tables
- `commitment_groups.frozen_at` (timestamptz, nullable) — when non-null, the group is frozen:
  its installments stop appearing in monthly commitment sums and the debt is shown as "congelada".

2. New functions
- `congelar_compromisso(_group_id uuid)` — sets frozen_at = now() on a commitment_group.
  Validates ownership via auth.uid(). Returns the group id on success.
- `descongelar_compromisso(_group_id uuid)` — sets frozen_at = null on a commitment_group.
  Validates ownership via auth.uid(). Returns the group id on success.

3. Security
- Both functions check `auth.uid() = user_id` on the commitment_groups row before updating.
- Both functions are granted to `authenticated` only.
- No new tables, no RLS policy changes needed (commitment_groups already has RLS).

4. Important notes
- Frozen groups are excluded from monthly sums by filtering on `frozen_at IS NULL` in the frontend.
- The `debts.category = 'congelada'` enum value already exists and is used by the frontend to
  classify frozen debts. The `frozen_at` column is the source of truth in the DB; the frontend
  maps `frozen_at != null` to `category = 'congelada'` when building the Debt object.
*/

-- Add frozen_at column
ALTER TABLE commitment_groups
  ADD COLUMN IF NOT EXISTS frozen_at timestamptz;

-- congelar_compromisso: freeze a commitment group
CREATE OR REPLACE FUNCTION public.congelar_compromisso(_group_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT user_id INTO v_user_id FROM commitment_groups WHERE id = _group_id;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Compromisso não encontrado' USING ERRCODE = 'P0002';
  END IF;
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Não autorizado' USING ERRCODE = 'P0001';
  END IF;

  UPDATE commitment_groups
    SET frozen_at = now(), updated_at = now()
    WHERE id = _group_id;

  RETURN _group_id;
END;
$$;

-- descongelar_compromisso: unfreeze a commitment group
CREATE OR REPLACE FUNCTION public.descongelar_compromisso(_group_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT user_id INTO v_user_id FROM commitment_groups WHERE id = _group_id;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Compromisso não encontrado' USING ERRCODE = 'P0002';
  END IF;
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Não autorizado' USING ERRCODE = 'P0001';
  END IF;

  UPDATE commitment_groups
    SET frozen_at = null, updated_at = now()
    WHERE id = _group_id;

  RETURN _group_id;
END;
$$;

-- Grant execute to authenticated only
REVOKE EXECUTE ON FUNCTION public.congelar_compromisso(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.congelar_compromisso(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.descongelar_compromisso(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.descongelar_compromisso(uuid) TO authenticated;