import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tandin Om U",
  description: "Notes on things I am learning as a student. Code, ideas, and things that finally clicked.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
