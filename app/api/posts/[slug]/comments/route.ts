import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const db = getSupabaseAdmin();
  const { data: post } = await db.from("posts").select("id").eq("slug", params.slug).single();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await db.from("comments").select("*").eq("post_id", post.id).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const { data: post } = await db.from("posts").select("id").eq("slug", params.slug).single();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { content, author_name } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  const { data, error } = await db.from("comments").insert({
    post_id: post.id,
    user_id: userId,
    author_name: author_name || "Anonymous",
    content: content.trim(),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
