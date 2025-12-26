import { slugRegex } from "@/lib/content/schema";

export type CategorySort = "latest" | "hot";

export type CategoryQueryState = {
  page: number;
  sort: CategorySort;
  tags: string[];
  q?: string;
};

export const MAX_CATEGORY_TAGS = 5;

const defaultState: CategoryQueryState = {
  page: 1,
  sort: "latest",
  tags: [],
  q: undefined,
};

type ParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

const getParam = (input: ParamsInput, key: string): string | null => {
  if (typeof (input as URLSearchParams).get === "function") {
    return (input as URLSearchParams).get(key);
  }
  const raw = (input as Record<string, string | string[] | undefined>)[key];
  return Array.isArray(raw) ? raw[0] ?? null : raw ?? null;
};

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseSort = (value: string | null): CategorySort => (value === "hot" ? "hot" : "latest");

const parseTags = (value: string | null) => {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && slugRegex.test(tag));
  return Array.from(new Set(tags)).slice(0, MAX_CATEGORY_TAGS);
};

export function parseCategoryParams(input: ParamsInput): CategoryQueryState {
  const q = getParam(input, "q")?.trim() || undefined;
  const page = parseNumber(getParam(input, "page"), defaultState.page);
  const sort = parseSort(getParam(input, "sort"));
  const tags = parseTags(getParam(input, "tags"));

  return {
    q,
    page,
    sort,
    tags,
  };
}

export function normalizeCategoryState(state: CategoryQueryState): CategoryQueryState {
  return {
    ...state,
    q: state.q?.trim() || undefined,
    tags: Array.from(new Set(state.tags)).slice(0, MAX_CATEGORY_TAGS),
    page: Math.max(1, state.page || 1),
  };
}

export function resetPageOnChange(current: CategoryQueryState, next: CategoryQueryState) {
  const queryChanged = current.q !== next.q;
  const filtersChanged =
    current.sort !== next.sort || current.tags.join(",") !== next.tags.join(",");

  return queryChanged || filtersChanged ? { ...next, page: 1 } : next;
}

export function buildCategoryHref(slug: string, state: Partial<CategoryQueryState>): string {
  const merged: CategoryQueryState = {
    ...defaultState,
    ...state,
    tags: state.tags ?? defaultState.tags,
  };

  const params = new URLSearchParams();
  if (merged.page > 1) params.set("page", String(merged.page));
  if (merged.sort !== defaultState.sort) params.set("sort", merged.sort);
  if (merged.tags.length > 0) params.set("tags", merged.tags.join(","));
  if (merged.q) params.set("q", merged.q);

  const qs = params.toString();
  return qs ? `/categories/${slug}?${qs}` : `/categories/${slug}`;
}
