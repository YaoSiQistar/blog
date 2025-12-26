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

  const likeCounts = new Map<string, number>();
  const commentCounts = new Map<string, number>();
  const chunks = chunk(uniqueSlugs, 400);

  for (const batch of chunks) {
    const [likesResult, commentsResult] = await Promise.all([
      supabaseAdmin.from("likes").select("post_slug").in("post_slug", batch),
      supabaseAdmin
        .from("comments")
        .select("post_slug")
        .in("post_slug", batch)
        .eq("status", "approved"),
    ]);

    if (likesResult.error || commentsResult.error) {
      throw new Error(
        likesResult.error?.message ||
          commentsResult.error?.message ||
          "Failed to load engagement scores."
      );
    }

    (likesResult.data ?? []).forEach((row) => {
      const slug = row.post_slug;
      likeCounts.set(slug, (likeCounts.get(slug) ?? 0) + 1);
    });

    (commentsResult.data ?? []).forEach((row) => {
      const slug = row.post_slug;
      commentCounts.set(slug, (commentCounts.get(slug) ?? 0) + 1);
    });
  }

  const scores: EngagementScores = {};
  uniqueSlugs.forEach((slug) => {
    const likes = likeCounts.get(slug) ?? 0;
    const comments = commentCounts.get(slug) ?? 0;
    scores[slug] = likes + comments;
  });

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
