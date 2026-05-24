"use client";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export default function CommentsSection({ slug }: { slug: string }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${slug}/comments`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setComments(d));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    const authorName = user?.fullName || user?.username || "Anonymous";
    const res = await fetch(`/api/posts/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, author_name: authorName }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to post"); setSubmitting(false); return; }
    setComments((prev) => [...prev, data]);
    setText("");
    setSubmitting(false);
  }

  return (
    <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
      <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.68rem", color: "var(--blue-light)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Comments ({comments.length})
      </p>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>No comments yet. Be the first.</p>
      ) : (
        <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {comments.map((c) => (
            <div key={c.id} style={{ padding: "1rem", background: "var(--navy-mid)", borderRadius: "6px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text)" }}>{c.author_name}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            style={{
              width: "100%", background: "var(--navy-mid)", border: "1px solid var(--border)",
              color: "var(--text)", padding: "0.75rem 1rem", borderRadius: "6px",
              fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", lineHeight: 1.65,
              resize: "vertical", outline: "none",
            }}
          />
          {error && <p style={{ color: "#ef4444", fontSize: "0.78rem" }}>{error}</p>}
          <div>
            <button type="submit" disabled={submitting || !text.trim()} className="btn-primary" style={{ fontSize: "0.78rem" }}>
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          <a href="/sign-in" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>Sign in</a> to leave a comment.
        </p>
      )}
    </div>
  );
}
