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

const squares = [
  { w:18,bg:"#4a7fc1",t:8,l:12,d:"3.2s",dl:"0s",op:0.9 },
  { w:14,bg:"#2a5aaa",t:15,l:28,d:"3.6s",dl:"0.2s",op:0.8 },
  { w:20,bg:"#5a8fd1",t:5,l:45,d:"2.9s",dl:"0.4s",op:0.95 },
  { w:12,bg:"#4a7fc1",t:20,l:62,d:"3.3s",dl:"0.1s",op:0.7 },
  { w:16,bg:"#2a5aaa",t:10,l:75,d:"3.7s",dl:"0.3s",op:0.85 },
  { w:22,bg:"#5a8fd1",t:3,l:88,d:"3s",dl:"0.5s",op:0.9 },
  { w:10,bg:"#4a7fc1",t:25,l:92,d:"3.4s",dl:"0.2s",op:0.75 },
  { w:15,bg:"#3a6aaa",t:35,l:5,d:"3.1s",dl:"0.6s",op:0.8 },
  { w:19,bg:"#4a7fc1",t:40,l:20,d:"3.5s",dl:"0.3s",op:0.9 },
  { w:13,bg:"#5a8fd1",t:30,l:35,d:"2.8s",dl:"0.1s",op:0.85 },
  { w:17,bg:"#2a5aaa",t:45,l:52,d:"3.6s",dl:"0.4s",op:0.7 },
  { w:11,bg:"#4a7fc1",t:38,l:68,d:"3.2s",dl:"0.2s",op:0.8 },
  { w:20,bg:"#3a6aaa",t:28,l:80,d:"2.9s",dl:"0.5s",op:0.95 },
  { w:14,bg:"#5a8fd1",t:55,l:8,d:"3.8s",dl:"0.3s",op:0.75 },
  { w:18,bg:"#2a5aaa",t:60,l:25,d:"3.1s",dl:"0.7s",op:0.9 },
  { w:12,bg:"#4a7fc1",t:50,l:42,d:"3.4s",dl:"0.2s",op:0.8 },
  { w:16,bg:"#5a8fd1",t:65,l:58,d:"2.7s",dl:"0.4s",op:0.85 },
  { w:10,bg:"#3a6aaa",t:58,l:72,d:"3.3s",dl:"0.1s",op:0.7 },
  { w:21,bg:"#2a5aaa",t:48,l:85,d:"3.6s",dl:"0.3s",op:0.9 },
  { w:13,bg:"#4a7fc1",t:72,l:15,d:"3s",dl:"0.6s",op:0.8 },
  { w:17,bg:"#5a8fd1",t:78,l:32,d:"3.5s",dl:"0.2s",op:0.75 },
  { w:15,bg:"#3a6aaa",t:70,l:48,d:"2.8s",dl:"0.4s",op:0.85 },
  { w:19,bg:"#2a5aaa",t:82,l:65,d:"3.2s",dl:"0.1s",op:0.9 },
  { w:11,bg:"#4a7fc1",t:75,l:78,d:"3.7s",dl:"0.3s",op:0.7 },
  { w:16,bg:"#5a8fd1",t:85,l:90,d:"3.1s",dl:"0.5s",op:0.8 },
];

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <>
      <Navbar />

      {/* HERO wrapper — overflow visible so squares go beyond hills */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #0d1a35 0%, #0a0e1a 100%)" }}>

        {/* Squares spread across full hero INCLUDING below hills */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", overflow: "visible" }}>
          {squares.map((sq, i) => (
            <div key={i} style={{
              position: "absolute",
              width: sq.w, height: sq.w,
              background: sq.bg,
              borderRadius: "3px",
              top: `${sq.t}%`,
              left: `${sq.l}%`,
              opacity: sq.op,
              animation: `sqFloat ${sq.d} ease-in-out infinite ${sq.dl}`,
            }} />
          ))}
        </div>

        {/* Hills — behind squares */}
        <div style={{ position: "relative", height: "420px", overflow: "hidden" }}>
          <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "240px", width: "100%" }}
            viewBox="0 0 1440 240" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,240 L0,150 Q200,60 420,130 Q640,200 860,110 Q1080,20 1280,100 Q1380,140 1440,90 L1440,240 Z" fill="#0d1830" opacity="0.9"/>
            <path d="M0,240 L0,185 Q250,120 520,165 Q780,210 1040,155 Q1250,110 1440,155 L1440,240 Z" fill="#0b1425" opacity="0.95"/>
            <path d="M0,240 L0,215 Q360,170 720,200 Q1080,230 1440,205 L1440,240 Z" fill="#0a1020"/>
          </svg>

          {/* Hero text */}
          <div style={{
            position: "absolute", left: "3rem",
            top: "50%", transform: "translateY(-60%)", zIndex: 4,
          }}>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.75rem", fontWeight: 800,
              color: "#7eb3ff", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: "1rem",
            }}>
              Notes
            </p>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "1.15rem",
              color: "rgba(200,212,232,0.85)",
              lineHeight: 1.9,
              maxWidth: "380px",
              fontWeight: 500,
            }}>
              notes on things I am learning.<br />
              code, ideas, and things that finally clicked.
            </p>
          </div>
        </div>

        <style>{`
          @keyframes sqFloat {
            0%,100% { transform: translateY(0px) rotate(0deg); }
            50%      { transform: translateY(-14px) rotate(6deg); }
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
                <Link href={`/blog/${post.slug}`} className="read-more">Read more</Link>
              </div>
            ))
          )}
        </div>

        <div>
          {posts.length > 0 && (
            <div style={{ marginBottom: "2.8rem" }}>
              <div className="section-label" style={{ marginBottom: "1.1rem" }}>Popular Notes</div>
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
            <a key={l} href="#" style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(200,212,232,0.2)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
