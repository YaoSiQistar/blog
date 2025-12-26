import "server-only";

import { getAllPostsIndex } from "@/lib/content";
import { getEngagementScoresForSlugs } from "@/lib/engagement/queries";
import type { PostIndexItem, PostsPagedResult } from "@/lib/content/types";
import type { TagSort } from "./searchParams";

const sortByDateDesc = <T extends { dateTimestamp: number }>(items: T[]) =>
  [...items].sort((a, b) => b.dateTimestamp - a.dateTimestamp);

const sortByHot = async <T extends { slug: string; dateTimestamp: number }>(items: T[]) => {
  const scores = await getEngagementScoresForSlugs(items.map((item) => item.slug));
  return [...items].sort((a, b) => {
    const diff = (scores[b.slug] ?? 0) - (scores[a.slug] ?? 0);
    if (diff !== 0) return diff;
    return b.dateTimestamp - a.dateTimestamp;
  });
};

export type TagPostsResult = PostsPagedResult & {
  baseCount: number;
  latestDate?: string;
};

export async function getPostsByTag(params: {
  tag: string;
  withTags?: string[];
  q?: string;
  sort?: TagSort;
  page?: number;
  pageSize?: number;
}): Promise<TagPostsResult> {
  const {
    tag,
    withTags = [],
    q,
    sort = "latest",
    page = 1,
    pageSize = 8,
  } = params;

  const posts = await getAllPostsIndex();
  const base = posts.filter((post) => post.tags.includes(tag));

  let latestDate: string | undefined;
  let latestTimestamp = 0;
  base.forEach((post) => {
    if (post.dateTimestamp > latestTimestamp) {
      latestTimestamp = post.dateTimestamp;
      latestDate = post.date;
    }
  });

  let filtered = base;
  if (withTags.length > 0) {
    filtered = filtered.filter((post) => withTags.every((t) => post.tags.includes(t)));
  }

  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(needle);
    });
  }

  const sorted = sort === "hot" ? await sortByHot(filtered) : sortByDateDesc(filtered);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize).map((post) => post as PostIndexItem);

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
    baseCount: base.length,
    latestDate,
  };
}
