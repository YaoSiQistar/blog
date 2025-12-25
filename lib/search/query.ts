import type { SearchQueryState, SearchScope, SearchSort } from "./types";

export const MAX_SEARCH_TAGS = 5;

const defaultState: SearchQueryState = {
  q: undefined,
  page: 1,
  sort: "relevance",
  scope: "all",
  category: undefined,
  tags: [],
};

const parseTags = (value: string | null) => {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  return Array.from(new Set(tags)).slice(0, MAX_SEARCH_TAGS);
};

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseScope = (value: string | null): SearchScope => {
  if (value === "title" || value === "content" || value === "tags") return value;
  return "all";
};

const parseSort = (value: string | null): SearchSort => {
  if (value === "latest") return "latest";
  return "relevance";
};

type ParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

const getParam = (input: ParamsInput, key: string): string | null => {
  if (typeof (input as URLSearchParams).get === "function") {
    return (input as URLSearchParams).get(key);
  }
  const raw = input[key];
  return Array.isArray(raw) ? raw[0] ?? null : raw ?? null;
};

export function parseSearchParams(input: ParamsInput): SearchQueryState {
  const q = getParam(input, "q")?.trim() || undefined;
  const page = parseNumber(getParam(input, "page"), defaultState.page);
  const sort = parseSort(getParam(input, "sort"));
  const scope = parseScope(getParam(input, "scope"));
  const category = getParam(input, "category")?.trim() || undefined;
  const tags = parseTags(getParam(input, "tags"));

  return {
    q,
    page,
    sort,
    scope,
    category,
    tags,
  };
}

export function buildSearchHref(state: Partial<SearchQueryState>): string {
  const merged: SearchQueryState = {
    ...defaultState,
    ...state,
    tags: state.tags ?? defaultState.tags,
  };

  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.page > 1) params.set("page", String(merged.page));
  if (merged.sort !== defaultState.sort) params.set("sort", merged.sort);
  if (merged.scope !== defaultState.scope) params.set("scope", merged.scope);
  if (merged.category) params.set("category", merged.category);
  if (merged.tags.length > 0) params.set("tags", merged.tags.join(","));

  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

export function normalizeSearchState(next: SearchQueryState): SearchQueryState {
  return {
    ...next,
    q: next.q?.trim() || undefined,
    tags: Array.from(new Set(next.tags)).slice(0, MAX_SEARCH_TAGS),
    page: Math.max(1, next.page || 1),
  };
}

export function resetPageOnChange(current: SearchQueryState, next: SearchQueryState) {
  const queryChanged = current.q !== next.q;
  const filtersChanged =
    current.scope !== next.scope ||
    current.sort !== next.sort ||
    current.category !== next.category ||
    current.tags.join(",") !== next.tags.join(",");

  return queryChanged || filtersChanged ? { ...next, page: 1 } : next;
}
