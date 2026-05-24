import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { userId } = auth();
  const db = getSupabaseAdmin();
  const { data: post } = await db.from("posts").select("id").eq("slug", params.slug).single();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { count } = await db.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);

  let liked = false;
  if (userId) {
    const { data } = await db.from("likes").select("id").eq("post_id", post.id).eq("user_id", userId).maybeSingle();
    liked = !!data;
  }

  return NextResponse.json({ count: count || 0, liked });
}

export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const { data: post } = await db.from("posts").select("id").eq("slug", params.slug).single();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: existing } = await db.from("likes").select("id").eq("post_id", post.id).eq("user_id", userId).maybeSingle();

  if (existing) {
    await db.from("likes").delete().eq("id", existing.id);
  } else {
    await db.from("likes").insert({ post_id: post.id, user_id: userId });
  }

  const { count } = await db.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);
  return NextResponse.json({ liked: !existing, count: count || 0 });
}
