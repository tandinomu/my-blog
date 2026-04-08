import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 3rem" }}>
        <Link href="/" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textDecoration: "none", display: "inline-block", marginBottom: "3rem" }}>← Home</Link>

        <span className="section-label">About</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "3rem", color: "var(--ink)", letterSpacing: "-0.03em", margin: "0.5rem 0 0.25rem" }}>
          Tandin Om U
        </h1>
        <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2rem" }}>CS Student</p>

        <div style={{ height: "2px", background: "var(--ink)", opacity: 0.08, marginBottom: "2rem" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {[
            "Hi, I am Tandin Om U — a software engineering student sharing notes on what I am learning. This blog is my way of studying in public, writing down things that confused me, things that clicked, and everything in between.",
            "I write mostly about things i learned in class and the tools I use day to day. If something helped me understand a concept, I write it down here so it might help someone else too.",
            "This blog is built with Next.js, Clerk, and Supabase — and yes, building it taught me more than any tutorial.",
          ].map((p, i) => (
            <p key={i} style={{ fontSize: "1rem", color: "var(--ink)", lineHeight: 1.85, opacity: 0.8 }}>{p}</p>
          ))}
        </div>

        <div style={{ height: "1px", background: "var(--border)", margin: "2.5rem 0" }} />

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[["GitHub", "https://github.com"], ["LinkedIn", "https://linkedin.com"]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="read-more">{label} →</a>
          ))}
          <Link href="/blog" className="read-more">Read my notes →</Link>
        </div>
      </main>
    </>
  );
}
