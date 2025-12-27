import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ApprovedComment } from "@/lib/comments/types";

export type EngagementCounts = {
  likes: number;
  favorites: number;
  commentsApproved: number;
};

export type ViewerState = {
  liked: boolean;
  favorited: boolean;
};

type EngagementScores = Record<string, number>;

const chunk = <T>(items: T[], size: number) => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

export async function getEngagementScoresForSlugs(slugs: string[]): Promise<EngagementScores> {
  const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean)));
  if (uniqueSlugs.length === 0) return {};

  const scores: EngagementScores = {};
  const chunks = chunk(uniqueSlugs, 400);

  for (const batch of chunks) {
    const { data, error } = await supabaseAdmin.rpc("get_engagement_scores", {
      slugs: batch,
    });

    if (error) {
      throw new Error(error.message || "Failed to load engagement scores.");
    }

    (data ?? []).forEach((row: { post_slug: string; score: number }) => {
      scores[row.post_slug] = row.score ?? 0;
    });
  }

  return scores;
}

export async function getCounts(postSlug: string): Promise<EngagementCounts> {
  const [likes, favorites, comments] = await Promise.all([
    supabaseAdmin
      .from("likes")
      .select("id", { head: true, count: "exact" })
      .eq("post_slug", postSlug),
    supabaseAdmin
      .from("favorites")
      .select("id", { head: true, count: "exact" })
      .eq("post_slug", postSlug),
    supabaseAdmin
      .from("comments")
      .select("id", { head: true, count: "exact" })
      .eq("post_slug", postSlug)
      .eq("status", "approved"),
  ]);

  if (likes.error || favorites.error || comments.error) {
    throw new Error(
      likes.error?.message ||
        favorites.error?.message ||
        comments.error?.message ||
        "Failed to load engagement counts."
    );
  }

  return {
    likes: likes.count ?? 0,
    favorites: favorites.count ?? 0,
    commentsApproved: comments.count ?? 0,
  };
}

export async function getViewerState(
  postSlug: string,
  params: { userId?: string | null; anonKey?: string | null }
): Promise<ViewerState> {
  const { userId, anonKey } = params;

  let liked = false;
  let favorited = false;

  if (userId) {
    const [likeResult, favoriteResult] = await Promise.all([
      supabaseAdmin
        .from("likes")
        .select("id")
        .eq("post_slug", postSlug)
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("favorites")
        .select("id")
        .eq("post_slug", postSlug)
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle(),
    ]);

    liked = Boolean(likeResult.data);
    favorited = Boolean(favoriteResult.data);
    return { liked, favorited };
  }

  if (anonKey) {
    const { data } = await supabaseAdmin
      .from("likes")
      .select("id")
      .eq("post_slug", postSlug)
      .eq("anon_key", anonKey)
      .limit(1)
      .maybeSingle();
    liked = Boolean(data);
  }

  return { liked, favorited: false };
}

export async function getApprovedComments(postSlug: string): Promise<ApprovedComment[]> {
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("id, post_slug, content, nickname, created_at")
    .eq("post_slug", postSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
