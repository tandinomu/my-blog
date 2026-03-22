import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0e1a",
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "'Fraunces', serif",
          color: "#4a7fc1", fontSize: "0.85rem",
          letterSpacing: "0.08em", marginBottom: "2rem",
        }}>
          Create your account
        </p>
        <SignUp />
      </div>
    </div>
  );
}
