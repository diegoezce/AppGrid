-- Apps table
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  image_url TEXT,
  app_url TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Transactions table (for future payments)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for apps (public read, authenticated write own)
CREATE POLICY "Apps are public readable" ON public.apps FOR SELECT USING (true);

CREATE POLICY "Users can insert their own apps" ON public.apps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own apps" ON public.apps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own apps" ON public.apps FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX idx_apps_user_id ON public.apps(user_id);
CREATE INDEX idx_apps_category ON public.apps(category);
CREATE INDEX idx_transactions_app_id ON public.transactions(app_id);
