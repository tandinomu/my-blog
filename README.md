# My Dev Blog

A cyberpunk-themed personal blog built with **Next.js 14**, **Clerk** (auth), **Supabase** (database), and deployed on **Vercel**.

---

## ✨ Features

- Dark cyberpunk UI — neon cyan/magenta, grid background, Space Mono font
- Sign in / Sign up with Clerk (modal or dedicated pages)
- Write, edit, and delete blog posts (only you can edit your own)
- Posts stored in Supabase with tags, excerpts, and slugs
- Fully server-rendered with Next.js App Router
- One-click deploy to Vercel

---

## 📁 Project Structure

```
my-blog/
├── app/
│   ├── page.tsx                  # Home page (hero + recent posts)
│   ├── layout.tsx                # Root layout with ClerkProvider
│   ├── globals.css               # Cyberpunk styles
│   ├── blog/
│   │   ├── page.tsx              # All posts listing
│   │   └── [slug]/page.tsx       # Single post view
│   ├── write/
│   │   └── page.tsx              # Create new post (auth protected)
│   ├── edit/
│   │   └── [slug]/page.tsx       # Edit/delete post (author only)
│   ├── sign-in/[[...sign-in]]/   # Clerk sign-in page
│   ├── sign-up/[[...sign-up]]/   # Clerk sign-up page
│   └── api/posts/
│       ├── route.ts              # GET all / POST new post
│       └── [slug]/route.ts       # GET / PATCH / DELETE one post
├── components/
│   └── Navbar.tsx                # Nav with Clerk auth buttons
├── lib/
│   └── supabase.ts               # Supabase client setup + Post type
├── middleware.ts                 # Protects /write and /edit routes
├── supabase-setup.sql            # Run this in Supabase SQL Editor
└── .env.local.example            # Copy to .env.local and fill in keys
```

---

## 🚀 Setup Guide

### Step 1 — Clone and install

```bash
git clone <your-repo-url> my-blog
cd my-blog
npm install
```

### Step 2 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Wait for it to provision (~1 min)
3. Go to **SQL Editor** → paste the contents of `supabase-setup.sql` → click **Run**
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)

### Step 3 — Set up Clerk

1. Go to [clerk.com](https://clerk.com) → Create a new application
2. Choose your login methods (Email, Google, GitHub, etc.)
3. Go to **API Keys** and copy:
   - `Publishable key` (starts with `pk_`)
   - `Secret key` (starts with `sk_`)

### Step 4 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in all the values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the home page!

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/my-blog.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo

3. In Vercel's **Environment Variables** section, add all 8 variables from your `.env.local`

4. Click **Deploy** — done! 🎉

---

## ✍️ How to Write Posts

1. Sign up / Sign in
2. Click **+ Write** in the navbar (or go to `/write`)
3. Fill in title, excerpt, content, and tags
4. Hit **PUBLISH POST** — it will redirect you to your new post

To edit or delete: open any post you wrote → click **EDIT POST** (top right)

---

## 🔒 How Auth + Security Works

| Route | Access |
|-------|--------|
| `/` | Public |
| `/blog` | Public |
| `/blog/[slug]` | Public |
| `/write` | **Signed in only** (middleware redirects) |
| `/edit/[slug]` | **Signed in + must be the author** |
| `POST /api/posts` | Clerk session required |
| `PATCH/DELETE /api/posts/[slug]` | Clerk session + author check |

Supabase uses **Row Level Security** — public reads are allowed, but all writes go through your API route using the service role key (never exposed to the browser).

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 14](https://nextjs.org) | Framework (App Router, SSR) |
| [Clerk](https://clerk.com) | Authentication |
| [Supabase](https://supabase.com) | PostgreSQL database |
| [Vercel](https://vercel.com) | Hosting + CDN |
| [Tailwind CSS](https://tailwindcss.com) | Utility styles |
| Space Mono + JetBrains Mono | Fonts |
