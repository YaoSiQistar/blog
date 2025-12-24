"use client";

import type { ReadonlyURLSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { PostSort } from "@/lib/content/types";

const MAX_TAGS = 5;

export type PostsQueryState = {
  category?: string;
  tags: string[];
  q?: string;
  sort: PostSort;
  page: number;
};

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseTags = (value: string | null) => {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  return Array.from(new Set(tags));
};

export function parsePostsQuery(params: ReadonlyURLSearchParams): PostsQueryState {
  return {
    category: params.get("category") || undefined,
    tags: parseTags(params.get("tags")),
    q: params.get("q") || undefined,
    sort: params.get("sort") === "hot" ? "hot" : "latest",
    page: parseNumber(params.get("page"), 1),
  };
}

export function buildPostsHref(state: PostsQueryState) {
  const query = new URLSearchParams();
  if (state.category) query.set("category", state.category);
  if (state.tags.length > 0) query.set("tags", state.tags.join(","));
  if (state.q) query.set("q", state.q);
  if (state.sort !== "latest") query.set("sort", state.sort);
  if (state.page > 1) query.set("page", String(state.page));

  const qs = query.toString();
  return qs.length > 0 ? `/posts?${qs}` : "/posts";
}

type UpdatePostsQueryOptions = {
  next: Partial<PostsQueryState>;
  resetPage?: boolean;
};

export function updatePostsQuery(
  params: ReadonlyURLSearchParams,
  { next, resetPage = false }: UpdatePostsQueryOptions
) {
  const current = parsePostsQuery(params);
  const merged: PostsQueryState = {
    ...current,
    ...next,
    tags: next.tags ? Array.from(new Set(next.tags)) : current.tags,
  };

  if (merged.tags.length > MAX_TAGS) {
    toast.info(`Select up to ${MAX_TAGS} tags.`);
    return { href: null, state: current, blocked: true };
  }

  const filterChanged =
    next.category !== undefined ||
    next.tags !== undefined ||
    next.sort !== undefined ||
    next.q !== undefined;

  if ((filterChanged || resetPage) && next.page === undefined) {
    merged.page = 1;
  }

  return { href: buildPostsHref(merged), state: merged, blocked: false };
}
