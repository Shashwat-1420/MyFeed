-- SavedFeed Supabase Database Schema
-- Includes pgvector extension, RLS, pluggable app_config, and match_saves RPC

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  streak_days INT DEFAULT 5,
  daily_nudge_time TEXT DEFAULT '09:00',
  dark_mode BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. App Config — Pluggable AI system table
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed pluggable AI defaults
INSERT INTO public.app_config (key, value, description) VALUES
  ('AI_PROVIDER',          'anthropic',          'Active AI provider: anthropic | openai | google | mistral'),
  ('AI_MODEL_CATEGORISE',  'claude-3-5-haiku-20241022', 'Model used for categorisation and tagging'),
  ('AI_MODEL_EMBED',       'text-embedding-3-small', 'Model used for 1536-dim vector embeddings'),
  ('AI_MODEL_SUMMARY',     'claude-3-5-sonnet-20241022', 'Model used for article summaries')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Saves table — Core data table
CREATE TABLE IF NOT EXISTS public.saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  domain TEXT,
  raw_text TEXT,
  source_platform TEXT,
  category TEXT NOT NULL DEFAULT 'uncategorized',
  tags TEXT[] DEFAULT '{}',
  embedding VECTOR(1536),
  times_viewed INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  next_resurface_at TIMESTAMPTZ,
  resurface_count INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  is_favourite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile only" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Own saves only" ON public.saves FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Config read" ON public.app_config FOR SELECT TO authenticated USING (TRUE);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS saves_user_id_idx ON public.saves(user_id);
CREATE INDEX IF NOT EXISTS saves_category_idx ON public.saves(category);
CREATE INDEX IF NOT EXISTS saves_resurface_idx ON public.saves(next_resurface_at);
CREATE INDEX IF NOT EXISTS saves_embedding_idx ON public.saves
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 7. Cosine Similarity Vector Search RPC
CREATE OR REPLACE FUNCTION match_saves(
  query_embedding VECTOR(1536),
  user_uuid UUID,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  url TEXT,
  description TEXT,
  category TEXT,
  domain TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    id, title, url, description, category, domain, image_url, created_at,
    1 - (embedding <=> query_embedding) AS similarity
  FROM saves
  WHERE user_id = user_uuid
    AND is_archived = FALSE
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
