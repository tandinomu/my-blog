import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tandin Om U",
  description: "Notes on things I am learning as a student.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
          <script dangerouslySetInnerHTML={{__html: `try{const t=localStorage.getItem('theme')||'dark';if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}`}} />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
