import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCounts, getViewerState } from "@/lib/engagement/queries";
import { resolveAnonKey, setAnonKeyCookie } from "@/lib/anon/anonKey";

export async function GET(request: NextRequest) {
  const postSlug = request.nextUrl.searchParams.get("postSlug")?.trim();
  if (!postSlug) {
    return NextResponse.json(
      { ok: false, error: "postSlug is required." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const { anonKey, isNew } = resolveAnonKey(request);

  try {
    const [counts, viewer] = await Promise.all([
      getCounts(postSlug),
      getViewerState(postSlug, { userId, anonKey }),
    ]);

    const response = NextResponse.json({
      ok: true,
      postSlug,
      counts,
      viewer,
    });

    if (isNew) {
      setAnonKeyCookie(response, anonKey);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to load engagement." },
      { status: 500 }
    );
  }
}
