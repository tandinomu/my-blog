import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase, Post } from "@/lib/supabase";

async function getAllPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "4rem 3rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>All Notes</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: "2.5rem", color: "#7eb3ff",
          letterSpacing: "-0.03em", marginBottom: "3rem",
        }}>
          Everything I have written
        </h1>

        {posts.length === 0 ? (
          <div style={{ color: "rgba(200,212,232,0.35)", fontSize: "0.85rem" }}>
            No notes yet.{" "}
            <Link href="/write" className="read-more">Write the first one.</Link>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="article-item">
              <div style={{ fontSize: "0.72rem", color: "rgba(200,212,232,0.3)", marginBottom: "0.5rem", fontWeight: 500 }}>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </div>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <h3>{post.title}</h3>
              </Link>
              <p>{post.excerpt}</p>
              {post.tags?.length > 0 && (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {post.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                </div>
              )}
              <Link href={`/blog/${post.slug}`} className="read-more">Read more</Link>
            </div>
          ))
        )}
      </main>
    </>
  );
}
