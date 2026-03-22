"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function WritePage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", tags: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, slug, excerpt: form.excerpt, content: form.content, tags, author_id: userId }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to publish"); setLoading(false); return; }
    router.push(`/blog/${data.slug}`);
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(13,24,48,0.8)",
    border: "1px solid rgba(74,127,193,0.2)",
    color: "rgba(200,212,232,0.9)",
    padding: "0.75rem 1rem",
    fontFamily: "'Lato', sans-serif",
    fontSize: "0.85rem",
    outline: "none",
    borderRadius: "6px",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "rgba(74,127,193,0.9)",
    textTransform: "uppercase" as const,
    marginBottom: "0.4rem",
    fontFamily: "'Lato', sans-serif",
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 3rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>New Note</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: "2rem", color: "#7eb3ff",
          letterSpacing: "-0.03em", marginBottom: "2.5rem",
        }}>
          Write something
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input type="text" required placeholder="What did you learn today?" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Short description</label>
            <input type="text" required placeholder="One sentence about this note..." value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Content</label>
            <textarea required rows={16} placeholder="Write your note here..." value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }} />
          </div>
          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input type="text" placeholder="nextjs, react, study" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })} style={inputStyle} />
          </div>

          {error && (
            <p style={{ color: "#7eb3ff", fontSize: "0.8rem", padding: "0.75rem 1rem",
              border: "1px solid rgba(74,127,193,0.3)", background: "rgba(26,58,110,0.2)", borderRadius: "6px" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ opacity: loading ? 0.5 : 1, fontSize: "0.85rem", padding: "0.6rem 1.8rem" }}>
              {loading ? "Publishing..." : "Publish note"}
            </button>
            <button type="button" className="btn-ghost" onClick={() => router.back()}
              style={{ fontSize: "0.85rem", padding: "0.6rem 1.5rem" }}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
