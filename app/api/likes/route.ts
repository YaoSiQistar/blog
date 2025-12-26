import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCounts } from "@/lib/engagement/queries";
import { resolveAnonKey, setAnonKeyCookie } from "@/lib/anon/anonKey";

type LikePayload = {
  postSlug?: string;
  action?: "like" | "unlike";
};

export async function POST(request: NextRequest) {
  let payload: LikePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const postSlug = payload.postSlug?.trim();
  const action = payload.action;

  if (!postSlug || (action !== "like" && action !== "unlike")) {
    return NextResponse.json(
      { ok: false, error: "postSlug and action are required." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const { anonKey, isNew } = resolveAnonKey(request);
  const match = userId
    ? { post_slug: postSlug, user_id: userId }
    : { post_slug: postSlug, anon_key: anonKey };

  try {
    if (action === "like") {
      const { data: existing } = await supabaseAdmin
        .from("likes")
        .select("id")
        .match(match)
        .limit(1)
        .maybeSingle();

      if (!existing) {
        const insertPayload = userId
          ? { post_slug: postSlug, user_id: userId }
          : { post_slug: postSlug, anon_key: anonKey };
        const { error } = await supabaseAdmin.from("likes").insert(insertPayload);
        if (error) throw error;
      }
    }

    if (action === "unlike") {
      await supabaseAdmin.from("likes").delete().match(match);
    }

    const counts = await getCounts(postSlug);
    const response = NextResponse.json({
      ok: true,
      liked: action === "like",
      likeCount: counts.likes,
    });

    if (isNew) {
      setAnonKeyCookie(response, anonKey);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to update like." },
      { status: 500 }
    );
  }
}
