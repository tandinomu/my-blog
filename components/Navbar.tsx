"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("theme") || "dark";
    setDark(t !== "light");
    document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "");
  }, []);

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    setDark(!dark);
    document.documentElement.setAttribute("data-theme", next === "light" ? "light" : "");
    localStorage.setItem("theme", next);
  }

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: dark ? "rgba(10,14,26,0.92)" : "rgba(220,232,245,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: dark ? "1px solid rgba(100,140,220,0.1)" : "1px solid rgba(10,22,40,0.1)",
      padding: "0 3rem", height: "62px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      {/* Logo — exact old style */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Lato', sans-serif", fontWeight: 700,
          fontSize: "1.05rem",
          color: dark ? "#7eb3ff" : "#0d2f6e",
          letterSpacing: "-0.01em",
          transition: "color 0.3s",
        }}>
          Tandin Om{" "}
          <span style={{
            color: dark ? "#ffffff" : "#0a1f4e",
            fontWeight: 900,
            transition: "color 0.3s",
          }}>U</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        {/* Nav links */}
        {["Home", "Notes", "About"].map((label) => (
          <Link key={label} href={label === "Home" ? "/" : label === "Notes" ? "/blog" : "/about"} style={{
            fontSize: "0.88rem", fontWeight: 500,
            color: dark ? "rgba(200,212,232,0.55)" : "rgba(10,22,40,0.55)",
            textDecoration: "none", transition: "color 0.3s",
          }}>{label}</Link>
        ))}

        {/* Theme toggle — exact same subtle circle */}
        <button onClick={toggleTheme} style={{
          background: "none", border: "none",
          color: dark ? "rgba(200,212,232,0.35)" : "rgba(10,22,40,0.35)",
          cursor: "pointer", fontSize: "1rem",
          lineHeight: 1, padding: "4px", transition: "color 0.3s",
        }}>
          {dark ? "☀" : "◑"}
        </button>

        {/* Auth */}
        {isSignedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/write" className="btn-primary" style={{ fontSize: "0.78rem", padding: "0.38rem 1rem" }}>
              + Write
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <SignInButton mode="modal"><button className="btn-ghost">Sign in</button></SignInButton>
            <SignUpButton mode="modal"><button className="btn-primary">Sign up</button></SignUpButton>
          </div>
        )}
      </div>
    </nav>
  );
}
