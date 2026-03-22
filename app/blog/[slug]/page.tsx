import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";
import { supabase, Post } from "@/lib/supabase";

async function getPost(slug: string): Promise<Post | null> {
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).single();
  return data;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const { userId } = auth();
  const isAuthor = userId === post.author_id;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 3rem" }}>
        {/* Back + Edit */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <Link href="/blog" style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(200,212,232,0.35)", textDecoration: "none" }}>
            &larr; All notes
          </Link>
          {isAuthor && (
            <Link href={`/edit/${post.slug}`} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.9rem" }}>
              Edit
            </Link>
          )}
        </div>

        {/* Date */}
        <div style={{ fontSize: "0.72rem", color: "rgba(200,212,232,0.3)", fontWeight: 500, marginBottom: "0.9rem" }}>
          {new Date(post.created_at).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#7eb3ff",
          letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1.2rem",
        }}>
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {post.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(74,127,193,0.2)", marginBottom: "2.5rem" }} />

        {/* Content */}
        <article className="prose-content">
          {post.content.split("\n").map((line, i) => (
            <p key={i} style={{ minHeight: line === "" ? "1rem" : undefined }}>{line}</p>
          ))}
        </article>

        {/* Bottom */}
        <div style={{
          marginTop: "4rem", paddingTop: "2rem",
          borderTop: "1px solid rgba(74,127,193,0.1)",
          display: "flex", justifyContent: "space-between",
        }}>
          <Link href="/blog" style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(200,212,232,0.3)", textDecoration: "none" }}>
            &larr; All notes
          </Link>
          {isAuthor && (
            <Link href="/write" style={{ fontSize: "0.78rem", fontWeight: 500, color: "#4a7fc1", textDecoration: "none" }}>
              Write another
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
