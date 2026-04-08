import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await getSupabaseAdmin().from("posts").select("*").eq("slug", params.slug).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  const { data: existing } = await db.from("posts").select("author_id").eq("slug", params.slug).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.author_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { data, error } = await db.from("posts").update({ ...body, updated_at: new Date().toISOString() }).eq("slug", params.slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  const { data: existing } = await db.from("posts").select("author_id").eq("slug", params.slug).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.author_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { error } = await db.from("posts").delete().eq("slug", params.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}