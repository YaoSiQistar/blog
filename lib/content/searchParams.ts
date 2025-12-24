import { slugRegex } from "./schema";
import type { PostsQueryParams, PostSort } from "./types";

export interface NormalizedSearchParams extends Required<Pick<PostsQueryParams, "page" | "pageSize" | "sort">> {
  category?: string;
  tags: string[];
  q?: string;
}

const DEFAULT_PAGE_SIZE = 6;

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseTags = (value: string | undefined) => {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && slugRegex.test(tag));
  return Array.from(new Set(tags));
};

const parseSort = (value: string | undefined): PostSort =>
  value === "hot" ? "hot" : "latest";

export function normalizeSearchParams(
  params: Record<string, string | string[] | undefined>,
  options: { pageSize?: number } = {}
): NormalizedSearchParams {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const categoryValue = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const tagsValue = Array.isArray(params.tags) ? params.tags[0] : params.tags;
  const sortValue = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const qValue = Array.isArray(params.q) ? params.q[0] : params.q;

  const category =
    categoryValue && slugRegex.test(categoryValue) ? categoryValue : undefined;

  return {
    page: parseNumber(pageValue, 1),
    pageSize,
    sort: parseSort(sortValue),
    category,
    tags: parseTags(tagsValue),
    q: qValue?.trim() || undefined,
  };
}
