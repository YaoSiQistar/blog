import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveAnonKey, setAnonKeyCookie } from "@/lib/anon/anonKey";

type CommentPayload = {
  postSlug?: string;
  content?: string;
  nickname?: string;
};

export async function POST(request: NextRequest) {
  let payload: CommentPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const postSlug = payload.postSlug?.trim();
  const content = payload.content?.trim();
  const nickname = payload.nickname?.trim() || null;

  if (!postSlug || !content) {
    return NextResponse.json(
      { ok: false, error: "postSlug and content are required." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const { anonKey, isNew } = resolveAnonKey(request);

  try {
    const { error } = await supabaseAdmin.from("comments").insert({
      post_slug: postSlug,
      content,
      nickname,
      user_id: userId,
      status: "pending",
    });

    if (error) throw error;

    const response = NextResponse.json({ ok: true, status: "pending" });
    if (isNew) {
      setAnonKeyCookie(response, anonKey);
    }
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to submit comment." },
      { status: 500 }
    );
  }
}
