
-- 1) Add person_id to transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS person_id UUID REFERENCES public.people(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_person_id ON public.transactions(person_id);

-- 2) Backfill: create people from distinct third_party_financials.person_name per user
--    (case-insensitive dedup), avoiding conflicts with existing people (same lower(name)).
WITH candidates AS (
  SELECT DISTINCT tpf.user_id,
                  btrim(tpf.person_name) AS name
  FROM public.third_party_financials tpf
  WHERE tpf.person_id IS NULL
    AND coalesce(btrim(tpf.person_name), '') <> ''
),
missing AS (
  SELECT c.user_id, c.name
  FROM candidates c
  LEFT JOIN public.people p
    ON p.user_id = c.user_id
   AND lower(p.name) = lower(c.name)
  WHERE p.id IS NULL
)
INSERT INTO public.people (user_id, name, type)
SELECT user_id, name, 'contato'::person_type
FROM missing;

-- 3) Link third_party_financials rows to the matching people row
UPDATE public.third_party_financials tpf
SET person_id = p.id
FROM public.people p
WHERE tpf.person_id IS NULL
  AND p.user_id = tpf.user_id
  AND lower(p.name) = lower(btrim(tpf.person_name));
