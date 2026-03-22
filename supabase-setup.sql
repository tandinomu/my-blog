-- ============================================
-- SUPABASE SETUP: Run this in the SQL Editor
-- at https://supabase.com/dashboard
-- ============================================

-- 1. Create the posts table
CREATE TABLE IF NOT EXISTS posts (
  id          bigserial PRIMARY KEY,
  title       text NOT NULL,
  slug        text NOT NULL UNIQUE,
  excerpt     text DEFAULT '',
  content     text NOT NULL,
  tags        text[] DEFAULT '{}',
  author_id   text NOT NULL,  -- Clerk user ID
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 2. Index for fast slug lookups
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts (slug);

-- 3. Index for date sorting
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 5. Allow anyone to READ posts (public blog)
CREATE POLICY "Public can read posts"
  ON posts FOR SELECT
  USING (true);

-- 6. Only allow INSERT/UPDATE/DELETE via your API (service role bypasses RLS)
-- The service role key in your .env.local handles writes server-side.
-- No need for authenticated write policies since we use supabaseAdmin.

-- ============================================
-- Optional: Insert a sample post to test
-- ============================================
INSERT INTO posts (title, slug, excerpt, content, tags, author_id)
VALUES (
  'Hello World - My First Post',
  'hello-world',
  'Welcome to my dev blog where I share notes and ideas.',
  'Welcome to my blog!

This is where I will share my notes on web development, code snippets, and ideas.

Built with:
- Next.js 14 (App Router)
- Clerk for authentication
- Supabase for the database
- Deployed on Vercel

Stay tuned for more posts!',
  ARRAY['meta', 'nextjs', 'intro'],
  'demo-user-id'
);
