import { slugRegex } from "@/lib/content/schema";

export type TagSort = "latest" | "hot";

export type TagQueryState = {
  page: number;
  sort: TagSort;
  with: string[];
  q?: string;
};

export const MAX_WITH_TAGS = 3;

const defaultState: TagQueryState = {
  page: 1,
  sort: "latest",
  with: [],
  q: undefined,
};

type ParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

const getParam = (input: ParamsInput, key: string): string | null => {
  if (typeof (input as URLSearchParams).get === "function") {
    return (input as URLSearchParams).get(key);
  }
  const raw = input[key];
  return Array.isArray(raw) ? raw[0] ?? null : raw ?? null;
};

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseSort = (value: string | null): TagSort => (value === "hot" ? "hot" : "latest");

const parseWith = (value: string | null) => {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && slugRegex.test(tag));
  return Array.from(new Set(tags)).slice(0, MAX_WITH_TAGS);
};

export function parseTagParams(input: ParamsInput): TagQueryState {
  const q = getParam(input, "q")?.trim() || undefined;
  const page = parseNumber(getParam(input, "page"), defaultState.page);
  const sort = parseSort(getParam(input, "sort"));
  const withTags = parseWith(getParam(input, "with"));

  return {
    q,
    page,
    sort,
    with: withTags,
  };
}

export function normalizeTagState(state: TagQueryState): TagQueryState {
  return {
    ...state,
    q: state.q?.trim() || undefined,
    with: Array.from(new Set(state.with)).slice(0, MAX_WITH_TAGS),
    page: Math.max(1, state.page || 1),
  };
}

export function resetPageOnChange(current: TagQueryState, next: TagQueryState) {
  const queryChanged = current.q !== next.q;
  const filtersChanged =
    current.sort !== next.sort || current.with.join(",") !== next.with.join(",");

  return queryChanged || filtersChanged ? { ...next, page: 1 } : next;
}

export function buildTagHref(slug: string, state: Partial<TagQueryState>): string {
  const merged: TagQueryState = {
    ...defaultState,
    ...state,
    with: state.with ?? defaultState.with,
  };

  const params = new URLSearchParams();
  if (merged.page > 1) params.set("page", String(merged.page));
  if (merged.sort !== defaultState.sort) params.set("sort", merged.sort);
  if (merged.with.length > 0) params.set("with", merged.with.join(","));
  if (merged.q) params.set("q", merged.q);

  const qs = params.toString();
  return qs ? `/tags/${slug}?${qs}` : `/tags/${slug}`;
}
