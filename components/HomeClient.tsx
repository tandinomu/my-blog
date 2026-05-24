"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Post, readTime } from "@/lib/supabase";

function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Fade({ children, delay = "0s" }: { children: React.ReactNode; delay?: string }) {
  const ref = useScrollFade();
  return <div ref={ref} className="scroll-fade" style={{ transitionDelay: delay }}>{children}</div>;
}

const SQUARES = [
  { w:18,t:8,  l:12  },{ w:16,t:5,  l:45  },{ w:20,t:6,  l:88  },
  { w:14,t:20, l:28  },{ w:12,t:18, l:63  },{ w:16,t:15, l:78  },
  { w:10,t:30, l:35  },{ w:14,t:28, l:55  },{ w:11,t:25, l:72  },
  { w:16,t:35, l:19  },{ w:13,t:42, l:48  },{ w:15,t:38, l:82  },
  { w:10,t:48, l:8   },{ w:12,t:52, l:42  },{ w:14,t:50, l:65  },
  { w:17,t:55, l:93  },{ w:11,t:60, l:30  },{ w:13,t:62, l:58  },
  { w:16,t:65, l:74  },{ w:10,t:70, l:15  },{ w:14,t:68, l:50  },
  { w:12,t:75, l:86  },{ w:15,t:78, l:38  },{ w:11,t:80, l:62  },
  { w:18,t:85, l:95  },
].map((s, i) => ({
  ...s,
  d: ( 2 + (i * 0.15) % 1.2).toFixed(1) + "s",
  dl: ((i * 0.1) % 0.8).toFixed(1) + "s",
}));

function Hills({ dark }: { dark: boolean }) {
  return (
    <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "240px", width: "100%" }}
      viewBox="0 0 1440 240" preserveAspectRatio="none">
      <path d="M0,240 L0,150 Q200,60 420,130 Q640,200 860,110 Q1080,20 1280,100 Q1380,140 1440,90 L1440,240 Z"
        fill={dark ? "#0d1830" : "#b0cce8"} opacity="0.9"/>
      <path d="M0,240 L0,185 Q250,120 520,165 Q780,210 1040,155 Q1250,110 1440,155 L1440,240 Z"
        fill={dark ? "#0b1425" : "#a0bedd"} opacity="0.95"/>
      <path d="M0,240 L0,215 Q360,170 720,200 Q1080,230 1440,205 L1440,240 Z"
        fill={dark ? "#0a1020" : "#90b0d0"}/>
    </svg>
  );
}

export default function HomeClient({ posts, allTags, likeCounts }: { posts: Post[]; allTags: string[]; likeCounts: Record<number, number> }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [dark, setDark] = useState(true);
  const filtered = activeTag ? posts.filter((p) => p.tags?.includes(activeTag)) : posts;

  useEffect(() => {
    const check = () => setDark(document.documentElement.getAttribute("data-theme") !== "light");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const sqColor = dark ? "#90c4f8" : "#4a7fc1";
  const labelColor = dark ? "#7eb3ff" : "#1a3a6e";
  const textColor = dark ? "rgba(200,212,232,0.85)" : "rgba(10,30,60,0.85)";

  return (
    <>
      {/* HERO */}
      <div style={{
        position: "relative", height: "420px", overflow: "hidden",
        background: dark
          ? "linear-gradient(180deg, #0d1a35 0%, #0a0e1a 100%)"
          : "linear-gradient(180deg, #b8d5ee 0%, #dce8f5 100%)",
        transition: "background 0.3s",
      }}>
        <Hills dark={dark} />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
          {SQUARES.map((sq, i) => (
            <div key={i} style={{
              position: "absolute",
              width: sq.w, height: sq.w,
              background: sqColor,
              borderRadius: "4px",
              top: `${sq.t * 4}px`,
              left: `${sq.l}%`,
              opacity: 0.8,
              animation: `sqFloat ${sq.d} ease-in-out infinite ${sq.dl}`,
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Hero text — bigger fonts */}
        <div style={{ position: "absolute", left: "3rem", top: "50%", transform: "translateY(-50%)", zIndex: 3 }}>
          <p className="f2" style={{
            fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 700,
            color: labelColor, letterSpacing: "0.22em",
            textTransform: "uppercase", marginBottom: "1.2rem",
            transition: "color 0.3s",
          }}>
            Notes
          </p>
          <p className="f3" style={{
            fontFamily: "'Lato', sans-serif", fontSize: "1.25rem",
            color: textColor, lineHeight: 1.75, maxWidth: "400px",
            transition: "color 0.3s",
          }}>
            notes on things I am learning.<br />
            code, ideas, and things that finally clicked.
          </p>
        </div>

        {/* Scroll arrow */}
        <div style={{ position: "absolute", bottom: "16px", left: "50%", animation: "bounceDown 1.8s ease-in-out infinite", zIndex: 4 }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: dark ? "rgba(13,22,40,0.7)" : "rgba(160,190,220,0.7)",
            border: "1px solid rgba(100,140,220,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: dark ? "rgba(200,212,232,0.4)" : "rgba(10,30,60,0.5)",
            fontSize: "0.8rem",
          }}>↓</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "4rem 3rem 5rem", display: "grid", gridTemplateColumns: "1fr 300px", gap: "5rem" }}>

        {/* Articles */}
        <div>
          <p className="section-label" style={{ marginBottom: "2rem", fontSize: "0.72rem" }}>Notes and Projects</p>

          {filtered.length === 0 ? (
            <div style={{ paddingTop: "1rem", fontSize: "1.05rem", color: "var(--muted)" }}>
              No notes yet.{" "}
              <Link href="/write" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>
                Write your first note.
              </Link>
            </div>
          ) : (
            filtered.map((post, i) => (
              <Fade key={post.id} delay={`${i * 0.07}s`}>
                <div className="article-item">
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <h3>{post.title}</h3>
                  </Link>
                  <p>{post.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <Link href={`/blog/${post.slug}`} className="read-more">
                      Read more <span className="arrow">→</span>
                    </Link>
                    <span className="read-time">{readTime(post.content)}</span>
                    {post.tags?.slice(0, 2).map(t => (
                      <span key={t} style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{t}</span>
                    ))}
                    {post.author_name && (
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: "auto" }}>by {post.author_name}</span>
                    )}
                  </div>
                </div>
              </Fade>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div>
          {allTags.length > 0 && (
            <Fade>
              <div style={{ marginBottom: "3rem" }}>
                <p className="section-label" style={{ marginBottom: "1.2rem" }}>Browse by Category</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span className={`tag ${!activeTag ? "active" : ""}`} onClick={() => setActiveTag(null)}>All</span>
                  {allTags.map((t) => (
                    <span key={t} className={`tag ${activeTag === t ? "active" : ""}`}
                      onClick={() => setActiveTag(activeTag === t ? null : t)}>{t}</span>
                  ))}
                </div>
              </div>
            </Fade>
          )}

          {(() => {
            const popular = [...posts]
              .filter((p) => (likeCounts[p.id] || 0) > 0)
              .sort((a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0))
              .slice(0, 6);
            return (
              <Fade delay="0.1s">
                <p className="section-label" style={{ marginBottom: "1.2rem" }}>Popular Notes</p>
                {popular.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="sidebar-link" style={{ alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "#ef4444", minWidth: "2rem" }}>
                      ♥ {likeCounts[post.id]}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{post.title}</span>
                  </Link>
                ))}
              </Fade>
            );
          })()}
        </div>
      </div>

      {/* Footer — shorter */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "0.9rem 3rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
          © {new Date().getFullYear()} <span style={{ color: "#7eb3ff", fontWeight: 700 }}>Tandin Om U</span> · Next.js · Clerk · Supabase
        </span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["GitHub", "LinkedIn"].map((l) => (
            <a key={l} href="#" style={{ fontSize: "0.72rem", color: "var(--muted)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
