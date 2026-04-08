import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — safe to use anywhere
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — only used in API routes (server-side only)
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(supabaseUrl, serviceKey);
}

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

export function readTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  return `${mins} min read`;
}