import Navbar from "@/components/Navbar";
import { supabase, Post, readTime } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

async function getPosts(): Promise<Post[]> {
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  return data || [];
}

export default async function Home() {
  const posts = await getPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  return (
    <>
      <Navbar />
      <HomeClient posts={posts} allTags={allTags} />
    </>
  );
}
