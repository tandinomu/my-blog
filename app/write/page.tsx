"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

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
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px;margin:0.5rem 0;" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hublpa])/gm, "")
    .replace(/[\s\S]+/, (m) => `<p>${m}</p>`);
}

function wordCount(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.ceil(words / 200);
  return { words, mins };
}

const DRAFT_KEY = "tandin_blog_draft";

export default function WritePage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const authorName = user?.fullName || user?.username || "Anonymous";
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [uploading, setUploading] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { words, mins } = wordCount(content);

  // Load drafts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try { setDrafts(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Autosave every 30s and on every keystroke (debounced)
  const saveDraft = useCallback(() => {
    if (!title && !content) return;
    setSaveStatus("saving");
    const draft = { id: Date.now(), title, content, excerpt, tags, savedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
    const updated = [draft, ...existing.filter((d: any) => d.title !== title).slice(0, 9)];
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
    setDrafts(updated);
    setTimeout(() => setSaveStatus("saved"), 300);
    setTimeout(() => setSaveStatus("idle"), 2500);
  }, [title, content, excerpt, tags]);

  useEffect(() => {
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(saveDraft, 1500);
    return () => clearTimeout(autoSaveRef.current);
  }, [title, content, excerpt, tags, saveDraft]);

  // Markdown toolbar
  function insertMarkdown(before: string, after = "") {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");
    const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content, tags: tagArr, author_id: userId, author_name: authorName }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to publish"); setLoading(false); return; }
    router.refresh();
    router.push(`/blog/${data.slug}`);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error || "Image upload failed"); return; }
    insertMarkdown(`\n![${file.name}](${data.url})\n`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function loadDraft(draft: any) {
    setTitle(draft.title);
    setContent(draft.content);
    setExcerpt(draft.excerpt || "");
    setTags(draft.tags || "");
    setShowDrafts(false);
  }

  function deleteDraft(id: number) {
    const updated = drafts.filter((d) => d.id !== id);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
    setDrafts(updated);
  }

  const inputBase = {
    width: "100%",
    background: "var(--paper-2)",
    border: "1px solid var(--border)",
    color: "var(--ink)",
    padding: "0.7rem 1rem",
    fontFamily: "'Lato', sans-serif",
    fontSize: "0.88rem",
    borderRadius: "4px",
    outline: "none",
  } as React.CSSProperties;

  const toolbarBtn = {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    cursor: "pointer",
    padding: "0.3rem 0.6rem",
    borderRadius: "3px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
    transition: "all 0.15s",
  } as React.CSSProperties;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 3rem" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <span className="section-label">New Note</span>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.3rem" }}>
              {words} words · {mins} min read
              {saveStatus === "saving" && <span style={{ marginLeft: "1rem", color: "var(--accent)" }}>Saving...</span>}
              {saveStatus === "saved" && <span style={{ marginLeft: "1rem", color: "#22c55e" }}>Saved</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button className="btn-ghost" onClick={() => setShowDrafts(!showDrafts)} style={{ fontSize: "0.75rem", position: "relative" }}>
              Drafts {drafts.length > 0 && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: "999px", fontSize: "0.6rem", padding: "0.1rem 0.4rem", marginLeft: "0.3rem" }}>{drafts.length}</span>}
            </button>
            <button
              onClick={() => {
                if (!title && !content) return;
                if (confirm("Delete this draft?")) {
                  const updated = drafts.filter((d) => d.title !== title);
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
                  setDrafts(updated);
                  setTitle(""); setContent(""); setExcerpt(""); setTags("");
                }
              }}
              style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "0.42rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
            >
              Delete draft
            </button>
            <button className="btn-primary" onClick={handleSubmit as any} disabled={loading} style={{ fontSize: "0.75rem", opacity: loading ? 0.5 : 1 }}>
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {/* Drafts panel */}
        {showDrafts && drafts.length > 0 && (
          <div style={{ background: "var(--paper-2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", marginBottom: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Saved Drafts</p>
            {drafts.map((d) => (
              <div key={d.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)" }}>{d.title || "Untitled"}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginLeft: "0.75rem" }}>{new Date(d.savedAt).toLocaleTimeString()}</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={() => loadDraft(d)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.2rem 0.6rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteDraft(d.id)} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "0.2rem 0.6rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Meta fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inputBase, fontFamily: "'Playfair Display', serif", fontSize: "1rem", gridColumn: "1 / -1" }} />
          <input placeholder="Short description *" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} style={{ ...inputBase, gridColumn: "1 / 3" }} />
          <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} style={inputBase} />
        </div>

        {/* Markdown toolbar */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          {[
            { label: "B", action: () => insertMarkdown("**", "**"), title: "Bold" },
            { label: "I", action: () => insertMarkdown("*", "*"), title: "Italic" },
            { label: "H1", action: () => insertMarkdown("# "), title: "Heading 1" },
            { label: "H2", action: () => insertMarkdown("## "), title: "Heading 2" },
            { label: "H3", action: () => insertMarkdown("### "), title: "Heading 3" },
            { label: "`code`", action: () => insertMarkdown("`", "`"), title: "Inline code" },
            { label: "> quote", action: () => insertMarkdown("> "), title: "Blockquote" },
            { label: "- list", action: () => insertMarkdown("- "), title: "List item" },
            { label: "link", action: () => insertMarkdown("[", "](url)"), title: "Link" },
          ].map((b) => (
            <button key={b.label} onClick={b.action} style={toolbarBtn} title={b.title}>{b.label}</button>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ ...toolbarBtn, opacity: uploading ? 0.5 : 1 }}
            title="Upload image"
            disabled={uploading}
          >
            {uploading ? "uploading..." : "image"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--muted)", alignSelf: "center" }}>Write · Preview</span>
        </div>

        {/* Editor + Preview */}
        <div className="md-editor">
          <textarea
            ref={textareaRef}
            className="md-input"
            placeholder="Write your note in markdown...

# Heading
**bold**, *italic*, `code`

> blockquote

- list item"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="md-preview prose-content" dangerouslySetInnerHTML={{ __html: content ? parseMarkdown(content) : '<p style="opacity:0.3">Preview appears here...</p>' }} />
        </div>

        {error && <p style={{ color: "red", fontSize: "0.82rem", marginTop: "1rem" }}>{error}</p>}
      </main>
    </>
  );
}
