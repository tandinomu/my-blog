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
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", tags: "" });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/posts/${params.slug}`);
      if (!res.ok) { router.push("/blog"); return; }
      const post = await res.json();
      if (post.author_id !== userId) { router.push(`/blog/${params.slug}`); return; }
      setForm({ title: post.title, excerpt: post.excerpt, content: post.content, tags: (post.tags || []).join(", ") });
      setFetching(false);
    }
    if (userId) load();
  }, [userId, params.slug, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const res = await fetch(`/api/posts/${params.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug, tags }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); setLoading(false); return; }
    router.push(`/blog/${data.slug}`);
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${params.slug}`, { method: "DELETE" });
    router.push("/blog");
  }

  const inputStyle = { width: "100%", background: "var(--paper-2)", border: "1px solid var(--border)", color: "var(--ink)", padding: "0.7rem 1rem", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", borderRadius: "4px", outline: "none" } as React.CSSProperties;

  if (fetching) return <><Navbar /><main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 3rem", color: "var(--muted)" }}>Loading...</main></>;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 3rem" }}>
        <span className="section-label">Edit Note</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "2rem", color: "var(--ink)", margin: "0.5rem 0 2rem" }}>Edit Post</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ ...inputStyle, fontFamily: "'Playfair Display', serif", fontSize: "1rem" }} />
          <input required placeholder="Short description" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={inputStyle} />
          <textarea required rows={16} placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }} />
          <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} style={inputStyle} />
          {error && <p style={{ color: "red", fontSize: "0.82rem" }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save changes"}</button>
              <button type="button" className="btn-ghost" onClick={() => router.back()}>Cancel</button>
            </div>
            <button type="button" onClick={handleDelete} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>Delete post</button>
          </div>
        </form>
      </main>
    </>
  );
}
