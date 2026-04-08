import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, tags } = body;
    if (!title || !slug || !content) return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 });
    const { data, error } = await getSupabaseAdmin().from("posts").insert({ title, slug, excerpt: excerpt || "", content, tags: tags || [], author_id: userId }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await getSupabaseAdmin().from("posts").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}