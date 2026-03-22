import { createClient } from "@supabase/supabase-js";

// Public client - for reading posts (used in frontend)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client - for writing posts (used in API routes only, never expose to client)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Type for a blog post
export type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  created_at: string;
  author_id: string;
};
