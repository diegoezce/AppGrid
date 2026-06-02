-- Builder Feed MVP Migration
-- Adds tables and fields for follows, application updates, and likes

-- 1. Extend users table with profile fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- 2. Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 3. Create application_updates table
CREATE TABLE IF NOT EXISTS public.application_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. Create update_likes table
CREATE TABLE IF NOT EXISTS public.update_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID NOT NULL REFERENCES public.application_updates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(update_id, user_id)
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_application_updates_app_id ON public.application_updates(app_id);
CREATE INDEX IF NOT EXISTS idx_application_updates_author_id ON public.application_updates(author_id);
CREATE INDEX IF NOT EXISTS idx_application_updates_created_at ON public.application_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_update_likes_update_id ON public.update_likes(update_id);
CREATE INDEX IF NOT EXISTS idx_update_likes_user_id ON public.update_likes(user_id);

-- 6. RLS Policies for follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_read_policy" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "follows_insert_policy" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_delete_policy" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- 7. RLS Policies for application_updates
ALTER TABLE public.application_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "updates_read_policy" ON public.application_updates
  FOR SELECT USING (true);

CREATE POLICY "updates_insert_policy" ON public.application_updates
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "updates_update_policy" ON public.application_updates
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "updates_delete_policy" ON public.application_updates
  FOR DELETE USING (auth.uid() = author_id);

-- 8. RLS Policies for update_likes
ALTER TABLE public.update_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "likes_read_policy" ON public.update_likes
  FOR SELECT USING (true);

CREATE POLICY "likes_insert_policy" ON public.update_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete_policy" ON public.update_likes
  FOR DELETE USING (auth.uid() = user_id);
