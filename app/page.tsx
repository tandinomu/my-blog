import Navbar from "@/components/Navbar";
import { supabase, Post } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

async function getPosts(): Promise<Post[]> {
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  return data || [];
}

async function getLikeCounts(): Promise<Record<number, number>> {
  const { data } = await supabase.from("likes").select("post_id");
  if (!data) return {};
  const counts: Record<number, number> = {};
  data.forEach(({ post_id }: { post_id: number }) => {
    counts[post_id] = (counts[post_id] || 0) + 1;
  });
  return counts;
}

export default async function Home() {
  const [posts, likeCounts] = await Promise.all([getPosts(), getLikeCounts()]);
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  return (
    <>
      <Navbar />
      <HomeClient posts={posts} allTags={allTags} likeCounts={likeCounts} />
    </>
  );
}
