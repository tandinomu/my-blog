import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase, Post } from "@/lib/supabase";

async function getRecentPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);
  return data || [];
}

// Generate random squares spread like stars across the whole hero
const squares = Array.from({ length: 60 }, (_, i) => ({
  w: Math.floor(Math.random() * 14) + 8,
  bg: ["#1a3a6e","#2a5aaa","#4a7fc1","#0d2050","#3a6aaa","#5a8fd1"][i % 6],
  t: Math.floor(Math.random() * 340),
  l: Math.floor(Math.random() * 95),
  d: (2.5 + Math.random() * 3).toFixed(1) + "s",
  dl: (Math.random() * 3).toFixed(1) + "s",
  op: (0.4 + Math.random() * 0.6).toFixed(2),
}));

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div style={{
        position: "relative",
        height: "420px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0d1a35 0%, #0a0e1a 100%)",
      }}>
        {/* Rolling hills */}
        <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "240px", width: "100%" }}
          viewBox="0 0 1440 240" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,240 L0,150 Q200,60 420,130 Q640,200 860,110 Q1080,20 1280,100 Q1380,140 1440,90 L1440,240 Z" fill="#0d1830" opacity="0.9"/>
          <path d="M0,240 L0,185 Q250,120 520,165 Q780,210 1040,155 Q1250,110 1440,155 L1440,240 Z" fill="#0b1425" opacity="0.95"/>
          <path d="M0,240 L0,215 Q360,170 720,200 Q1080,230 1440,205 L1440,240 Z" fill="#0a1020"/>
        </svg>

        {/* Stars/squares spread across whole hero */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          {squares.map((sq, i) => (
            <div key={i} style={{
              position: "absolute",
              width: sq.w,
              height: sq.w,
              background: sq.bg,
              borderRadius: "3px",
              top: `${sq.t}px`,
              left: `${sq.l}%`,
              opacity: Number(sq.op),
              animation: `sqFloat ${sq.d} ease-in-out infinite ${sq.dl}`,
            }} />
          ))}
        </div>

        {/* Hero text — left, above the hills */}
        <div style={{
          position: "absolute", left: "3rem",
          top: "50%", transform: "translateY(-60%)", zIndex: 3,
        }}>
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.72rem", fontWeight: 700,
            color: "#4a7fc1", letterSpacing: "0.16em",
            textTransform: "uppercase", marginBottom: "1rem",
          }}>
            Notes
          </p>
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "1rem", color: "rgba(200,212,232,0.45)",
            lineHeight: 1.8, maxWidth: "340px",
          }}>
            notes on things I am learning.<br />
            code, ideas, and things that finally clicked.
          </p>
        </div>

        <style>{`
          @keyframes sqFloat {
            0%   { transform: translateY(0px) rotate(0deg); opacity: inherit; }
            50%  { transform: translateY(-14px) rotate(8deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}</style>
      </div>

      {/* MAIN */}
      <div style={{
        maxWidth: "1060px", margin: "0 auto",
        padding: "3.5rem 3rem",
        display: "grid",
        gridTemplateColumns: "1fr 260px",
        gap: "5rem",
      }}>
        {/* Articles */}
        <div>
          <div className="section-label" style={{ marginBottom: "2rem" }}>
            Notes and Projects
          </div>

          {posts.length === 0 ? (
            <div style={{ color: "rgba(200,212,232,0.35)", fontSize: "0.85rem", lineHeight: 1.8 }}>
              <p>No notes yet.</p>
              <Link href="/write" className="read-more" style={{ marginTop: "1rem", display: "inline-block" }}>
                Write your first note
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="article-item">
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <h3>{post.title}</h3>
                </Link>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="read-more">
                  Read more
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div>
          {posts.length > 0 && (
            <div style={{ marginBottom: "2.8rem" }}>
              <div className="section-label" style={{ marginBottom: "1.1rem" }}>
                Popular Notes
              </div>
              {posts.slice(0, 5).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginBottom: "1rem" }}>
                    <span style={{ color: "#4a7fc1", fontSize: "0.78rem", marginTop: "2px", flexShrink: 0 }}>&#8594;</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(200,212,232,0.55)", lineHeight: 1.45 }}>
                      {post.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(100,140,220,0.08)",
        padding: "1.5rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "0.7rem", color: "rgba(200,212,232,0.2)", fontFamily: "'Lato', sans-serif" }}>
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "#4a7fc1", fontWeight: 600 }}>Tandin Om U</span>
          {" "}· Next.js · Clerk · Supabase
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["GitHub", "LinkedIn"].map((l) => (
            <a key={l} href="#" style={{
              fontSize: "0.72rem", fontWeight: 500,
              color: "rgba(200,212,232,0.2)", textDecoration: "none",
            }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
