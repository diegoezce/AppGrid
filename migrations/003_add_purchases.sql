ALTER TABLE public.apps
  ADD COLUMN IF NOT EXISTS payment_url TEXT;

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_purchases_app_id ON public.purchases(app_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
