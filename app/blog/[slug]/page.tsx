import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";
import { supabase, Post, readTime } from "@/lib/supabase";

async function getPost(slug: string): Promise<Post | null> {
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).single();
  return data;
}

function parseMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^\> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .split("\n\n").map(p => p.startsWith("<") ? p : `<p>${p}</p>`).join("\n");
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  const { userId } = auth();
  const isAuthor = userId === post.author_id;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 3rem" }}>
        {/* Back + edit */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
          <Link href="/blog" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.04em" }}>← All notes</Link>
          {isAuthor && <Link href={`/edit/${post.slug}`} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.9rem" }}>Edit</Link>}
        </div>

        {/* Tags + meta */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {post.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
          <span className="read-time" style={{ marginLeft: "auto" }}>{readTime(post.content)}</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900,
          fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--ink)",
          letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "0.75rem",
        }}>
          {post.title}
        </h1>

        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "2.5rem" }}>
          {new Date(post.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>

        {/* Divider */}
        <div style={{ height: "2px", background: "var(--ink)", opacity: 0.08, marginBottom: "2.5rem" }} />

        {/* Content */}
        <article className="prose-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />

        {/* Bottom */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <Link href="/blog" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textDecoration: "none" }}>← All notes</Link>
          {isAuthor && <Link href="/write" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>Write another →</Link>}
        </div>
      </main>
    </>
  );
}
