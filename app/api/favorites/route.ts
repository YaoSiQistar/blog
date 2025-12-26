import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCounts } from "@/lib/engagement/queries";

type FavoritePayload = {
  postSlug?: string;
  action?: "add" | "remove";
};

const resolvePayload = async (request: NextRequest): Promise<FavoritePayload> => {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug") ?? undefined;
  const action = searchParams.get("action") as FavoritePayload["action"] | null;

  if (postSlug || action) {
    return { postSlug: postSlug ?? undefined, action: action ?? undefined };
  }

  try {
    return await request.json();
  } catch {
    return {};
  }
};

const getUserId = async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

export async function POST(request: NextRequest) {
  const payload = await resolvePayload(request);

  const postSlug = payload.postSlug?.trim();
  const action = payload.action;

  if (!postSlug || (action !== "add" && action !== "remove")) {
    return NextResponse.json(
      { ok: false, error: "postSlug and action are required." },
      { status: 400 }
    );
  }

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    if (action === "add") {
      const { error } = await supabaseAdmin
        .from("favorites")
        .upsert({ post_slug: postSlug, user_id: userId }, { onConflict: "post_slug,user_id" });
      if (error) throw error;
    }

    if (action === "remove") {
      await supabaseAdmin
        .from("favorites")
        .delete()
        .eq("post_slug", postSlug)
        .eq("user_id", userId);
    }

    const counts = await getCounts(postSlug);
    return NextResponse.json({
      ok: true,
      favorited: action === "add",
      favoriteCount: counts.favorites,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to update favorite." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await resolvePayload(request);
  const postSlug = payload.postSlug?.trim();

  if (!postSlug) {
    return NextResponse.json({ ok: false, error: "postSlug is required." }, { status: 400 });
  }

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("post_slug", postSlug)
      .eq("user_id", userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to remove favorite." },
      { status: 500 }
    );
  }
}
