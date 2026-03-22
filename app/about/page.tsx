import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 3rem" }}>

        {/* Back link */}
        <Link href="/" style={{
          fontSize: "0.78rem", fontWeight: 500,
          color: "rgba(200,212,232,0.35)", textDecoration: "none",
          display: "inline-block", marginBottom: "2.5rem",
        }}>
          &larr; Home
        </Link>

        {/* Name */}
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: "clamp(2rem, 6vw, 3.2rem)",
          color: "#7eb3ff", letterSpacing: "-0.03em",
          lineHeight: 1.1, marginBottom: "0.3rem",
        }}>
          Tandin Om U
        </h1>

        <p style={{
          fontSize: "0.82rem", color: "#4a7fc1",
          fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: "2rem",
        }}>
          CST Student
        </p>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "rgba(74,127,193,0.2)",
          marginBottom: "2rem",
        }} />

        {/* Bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{
            fontSize: "0.9rem", color: "rgba(200,212,232,0.65)",
            lineHeight: 1.85,
          }}>
            Hi, I am Tandin Om U — a software engineering student sharing notes
            on what I am learning. This blog is my way of studying in public,
            writing down things that confused me, things that clicked, and
            everything in between.
          </p>
          <p style={{
            fontSize: "0.9rem", color: "rgba(200,212,232,0.65)",
            lineHeight: 1.85,
          }}>
            I write mostly about the modules I take in college, the projects I do and the tools I use day to day. If something helped me understand
            a concept, I write it down here so it might help someone else too.
          </p>
          <p style={{
            fontSize: "0.9rem", color: "rgba(200,212,232,0.65)",
            lineHeight: 1.85,
          }}>
            This blog is built with Next.js, Clerk, and Supabase — and yes,
            building it taught me more than any tutorial.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "rgba(74,127,193,0.1)",
          margin: "2.5rem 0",
        }} />

        {/* Links */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4a7fc1", textDecoration: "none" }}>
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4a7fc1", textDecoration: "none" }}>
            LinkedIn
          </a>
          <Link href="/blog"
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4a7fc1", textDecoration: "none" }}>
            Read my notes
          </Link>
        </div>

      </main>
    </>
  );
}
