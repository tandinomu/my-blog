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

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div style={{
        position: "relative",
        height: "380px",
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

        {/* Floating squares — right side */}
        <div style={{ position: "absolute", right: "100px", top: "30px", width: "360px", height: "300px", zIndex: 2 }}>
          {[
            { w:20,h:20,bg:"#1a3a6e",t:5,l:55,d:"3.2s",dl:"0s" },
            { w:20,h:20,bg:"#2a5aaa",t:-5,l:92,d:"3.6s",dl:"0.2s" },
            { w:20,h:20,bg:"#1a3a6e",t:-12,l:130,d:"2.9s",dl:"0.4s" },
            { w:20,h:20,bg:"#0d2050",t:-15,l:170,d:"3.3s",dl:"0.1s" },
            { w:20,h:20,bg:"#2a5aaa",t:-10,l:210,d:"3.7s",dl:"0.3s" },
            { w:20,h:20,bg:"#4a7fc1",t:-2,l:250,d:"3s",dl:"0.5s" },
            { w:20,h:20,bg:"#1a3a6e",t:14,l:285,d:"3.4s",dl:"0.2s" },
            { w:17,h:17,bg:"#4a7fc1",t:36,l:30,d:"3.1s",dl:"0.6s" },
            { w:17,h:17,bg:"#0d2050",t:24,l:65,d:"3.5s",dl:"0.3s" },
            { w:17,h:17,bg:"#2a5aaa",t:18,l:100,d:"2.8s",dl:"0.1s" },
            { w:17,h:17,bg:"#1a3a6e",t:14,l:138,d:"3.6s",dl:"0.4s" },
            { w:17,h:17,bg:"#4a7fc1",t:18,l:175,d:"3.2s",dl:"0.2s" },
            { w:17,h:17,bg:"#0d2050",t:28,l:212,d:"2.9s",dl:"0.5s" },
            { w:17,h:17,bg:"#2a5aaa",t:44,l:246,d:"3.8s",dl:"0.3s" },
            { w:14,h:14,bg:"#2a5aaa",t:68,l:14,d:"3s",dl:"0.7s" },
            { w:14,h:14,bg:"#1a3a6e",t:56,l:46,d:"3.4s",dl:"0.2s" },
            { w:14,h:14,bg:"#4a7fc1",t:50,l:78,d:"2.7s",dl:"0.4s" },
            { w:14,h:14,bg:"#0d2050",t:48,l:112,d:"3.1s",dl:"0.1s" },
            { w:14,h:14,bg:"#2a5aaa",t:52,l:146,d:"3.5s",dl:"0.3s" },
            { w:14,h:14,bg:"#1a3a6e",t:60,l:178,d:"2.8s",dl:"0.6s" },
            { w:12,h:12,bg:"#0d2050",t:98,l:6,d:"3.2s",dl:"0.5s" },
            { w:12,h:12,bg:"#4a7fc1",t:88,l:36,d:"3.7s",dl:"0.2s" },
            { w:12,h:12,bg:"#1a3a6e",t:84,l:66,d:"2.9s",dl:"0.4s" },
            { w:12,h:12,bg:"#2a5aaa",t:86,l:96,d:"3.3s",dl:"0.1s" },
            { w:12,h:12,bg:"#4a7fc1",t:94,l:125,d:"3.6s",dl:"0.3s" },
          ].map((sq, i) => (
            <div key={i} style={{
              position: "absolute",
              width: sq.w, height: sq.h,
              background: sq.bg,
              borderRadius: "3px",
              top: sq.t, left: sq.l,
              animation: `sqFloat ${sq.d} ease-in-out infinite ${sq.dl}`,
            }} />
          ))}
        </div>

        {/* Hero text — left */}
        <div style={{ position: "absolute", left: "3rem", top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
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
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
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
            Notes
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
