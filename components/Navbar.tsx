"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,14,26,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(100,140,220,0.1)",
      padding: "0 3rem",
      height: "62px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Lato', sans-serif",
          fontWeight: 700,
          fontSize: "1.15rem",
          color: "#7eb3ff",
          letterSpacing: "-0.01em",
        }}>
          Tandin Om{" "}
          <span style={{
            color: "#ffffff",
            fontWeight: 900,
          }}>
            U
          </span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <Link href="/" style={{ fontSize: "0.88rem", fontWeight: 500, color: "rgba(200,212,232,0.55)", textDecoration: "none", }}> Home </Link> <Link href="/blog" style={{
          fontSize: "0.88rem", fontWeight: 500,
          color: "rgba(200,212,232,0.55)", textDecoration: "none",
        }}>
          Notes
        </Link>
        <Link href="/about" style={{
          fontSize: "0.88rem", fontWeight: 500,
          color: "rgba(200,212,232,0.55)", textDecoration: "none",
        }}>
          About
        </Link>

        {isSignedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/write" className="btn-primary" style={{ fontSize: "0.78rem", padding: "0.38rem 1rem" }}>
              + Write
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <SignInButton mode="modal">
              <button className="btn-ghost">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary">Sign up</button>
            </SignUpButton>
          </div>
        )}
      </div>
    </nav>
  );
}
