"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function EditPage({ params }: { params: { slug: string } }) {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [postId, setPostId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  });

  // Load the existing post data
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/posts/${params.slug}`);
      if (!res.ok) { router.push("/blog"); return; }
      const post = await res.json();

      // Only the author can edit
      if (post.author_id !== userId) {
        router.push(`/blog/${params.slug}`);
        return;
      }

      setPostId(post.id);
      setForm({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: (post.tags || []).join(", "),
      });
      setFetching(false);
    }
    if (userId) load();
  }, [userId, params.slug, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !postId) return;

    setLoading(true);
    setError("");

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const res = await fetch(`/api/posts/${params.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, slug, excerpt: form.excerpt, content: form.content, tags }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to update"); setLoading(false); return; }
    router.push(`/blog/${data.slug}`);
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const res = await fetch(`/api/posts/${params.slug}`, { method: "DELETE" });
    if (res.ok) router.push("/blog");
    else setError("Failed to delete post");
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(10,22,40,0.8)",
    border: "1px solid rgba(0,245,212,0.2)",
    color: "rgba(200,220,230,0.9)",
    padding: "0.75rem 1rem",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.85rem",
    outline: "none",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "0.7rem",
    letterSpacing: "0.12em",
    color: "rgba(0,245,212,0.7)",
    fontFamily: "'Space Mono', monospace",
    textTransform: "uppercase" as const,
    marginBottom: "0.4rem",
  };

  if (fetching) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: "780px", margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ color: "rgba(0,245,212,0.5)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>
            // Loading post...
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "780px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <span className="section-label" style={{ marginBottom: "0.75rem", display: "block" }}>
            EDIT TRANSMISSION
          </span>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.8rem", color: "rgba(200,220,230,0.9)" }}>
            Edit Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Excerpt *</label>
            <input type="text" required value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Content *</label>
            <textarea required value={form.content} rows={18}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
          </div>
          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input type="text" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })} style={inputStyle} />
          </div>

          {error && (
            <p style={{ color: "#e91e8c", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace",
              padding: "0.75rem 1rem", border: "1px solid rgba(233,30,140,0.3)", background: "rgba(233,30,140,0.05)" }}>
              ⚠ {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" disabled={loading} className="btn-cyan" style={{ opacity: loading ? 0.5 : 1 }}>
                {loading ? "SAVING..." : "SAVE CHANGES →"}
              </button>
              <button type="button" className="btn-magenta" onClick={() => router.back()}>
                CANCEL
              </button>
            </div>
            <button type="button" onClick={handleDelete}
              style={{ background: "transparent", border: "1px solid rgba(233,30,140,0.4)", color: "rgba(233,30,140,0.6)",
                padding: "0.75rem 1.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
                letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" }}>
              DELETE POST
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
