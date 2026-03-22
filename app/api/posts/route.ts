import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  // Verify the user is signed in via Clerk
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, tags } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Insert into Supabase using the service role key (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert({
        title,
        slug,
        excerpt: excerpt || "",
        content,
        tags: tags || [],
        author_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
