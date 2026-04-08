import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase, Post, readTime } from "@/lib/supabase";

async function getAllPosts(): Promise<Post[]> {
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 3rem" }}>
        <span className="section-label">All Notes</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "3rem", color: "var(--ink)", letterSpacing: "-0.03em", margin: "0.5rem 0 3rem" }}>
          Everything I have written
        </h1>

        {posts.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No notes yet. <Link href="/write" className="read-more">Write the first one.</Link></p>
        ) : posts.map((post) => (
          <div key={post.id} className="article-item">
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
              {post.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
              <span className="read-time" style={{ marginLeft: "auto" }}>{readTime(post.content)}</span>
            </div>
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}><h3>{post.title}</h3></Link>
            <p>{post.excerpt}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href={`/blog/${post.slug}`} className="read-more">Read more →</Link>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
