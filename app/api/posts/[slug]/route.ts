import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/posts/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH /api/posts/[slug] - update a post (author only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify the caller is the author
  const { data: existing } = await supabaseAdmin
    .from("posts")
    .select("author_id")
    .eq("slug", params.slug)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.author_id !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, slug, excerpt, content, tags } = body;

  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({ title, slug, excerpt, content, tags, updated_at: new Date().toISOString() })
    .eq("slug", params.slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/posts/[slug] - delete a post (author only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify the caller is the author
  const { data: existing } = await supabaseAdmin
    .from("posts")
    .select("author_id")
    .eq("slug", params.slug)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.author_id !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabaseAdmin.from("posts").delete().eq("slug", params.slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
