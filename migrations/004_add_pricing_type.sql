ALTER TABLE public.apps
  ADD COLUMN IF NOT EXISTS pricing_type TEXT NOT NULL DEFAULT 'one_time';
