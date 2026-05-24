"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface Props {
  slug: string;
  isAuthor: boolean;
}

export default function PostActions({ slug, isAuthor }: Props) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}/like`)
      .then((r) => r.json())
      .then((d) => { setLikeCount(d.count); setLiked(d.liked); });
  }, [slug]);

  async function toggleLike() {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    setLikeLoading(true);
    const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
    const d = await res.json();
    setLiked(d.liked);
    setLikeCount(d.count);
    setLikeLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this note permanently?")) return;
    setDeleting(true);
    await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    router.push("/blog");
  }

  if (isAuthor) {
    return (
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <Link href={`/edit/${slug}`} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.9rem" }}>
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: "none", border: "1px solid #ef4444", color: "#ef4444",
            padding: "0.3rem 0.9rem", borderRadius: "6px", cursor: "pointer",
            fontSize: "0.75rem", fontWeight: 700, opacity: deleting ? 0.5 : 1,
            transition: "all 0.2s",
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleLike}
      disabled={likeLoading}
      style={{
        display: "flex", alignItems: "center", gap: "0.4rem",
        background: liked ? "rgba(239,68,68,0.1)" : "none",
        border: `1px solid ${liked ? "#ef4444" : "var(--border)"}`,
        color: liked ? "#ef4444" : "var(--muted)",
        padding: "0.3rem 0.9rem", borderRadius: "6px", cursor: "pointer",
        fontSize: "0.78rem", fontWeight: 600, transition: "all 0.2s",
      }}
      title={isSignedIn ? (liked ? "Unlike" : "Like") : "Sign in to like"}
    >
      <span style={{ fontSize: "1rem" }}>{liked ? "♥" : "♡"}</span>
      <span>{likeCount}</span>
    </button>
  );
}
