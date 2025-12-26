export type DossierTab = "favorites" | "likes" | "comments";
export type FavoritesSort = "saved" | "published";
export type DossierView = "list" | "compact";

export type DossierQueryState = {
  tab: DossierTab;
  sort: FavoritesSort;
  q?: string;
  page: number;
  view: DossierView;
};

const defaultState: DossierQueryState = {
  tab: "favorites",
  sort: "saved",
  q: undefined,
  page: 1,
  view: "list",
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

const parseTab = (value: string | null): DossierTab => {
  if (value === "likes" || value === "comments" || value === "favorites") return value;
  return "favorites";
};

const parseSort = (value: string | null): FavoritesSort => {
  if (value === "published") return "published";
  return "saved";
};

const parseView = (value: string | null): DossierView => {
  if (value === "compact") return "compact";
  return "list";
};

export function parseDossierParams(input: ParamsInput): DossierQueryState {
  const q = getParam(input, "q")?.trim() || undefined;
  const tab = parseTab(getParam(input, "tab"));
  const sort = parseSort(getParam(input, "sort"));
  const view = parseView(getParam(input, "view"));
  const page = parseNumber(getParam(input, "page"), defaultState.page);

  return {
    tab,
    sort,
    view,
    q,
    page,
  };
}

export function buildDossierHref(state: Partial<DossierQueryState>): string {
  const merged: DossierQueryState = {
    ...defaultState,
    ...state,
  };

  const params = new URLSearchParams();
  if (merged.tab !== defaultState.tab) params.set("tab", merged.tab);
  if (merged.sort !== defaultState.sort) params.set("sort", merged.sort);
  if (merged.view !== defaultState.view) params.set("view", merged.view);
  if (merged.q) params.set("q", merged.q);
  if (merged.page > 1) params.set("page", String(merged.page));

  const qs = params.toString();
  return qs ? `/me?${qs}` : "/me";
}

export function normalizeDossierState(next: DossierQueryState): DossierQueryState {
  return {
    ...next,
    q: next.q?.trim() || undefined,
    page: Math.max(1, next.page || 1),
  };
}

export function resetPageOnChange(current: DossierQueryState, next: DossierQueryState) {
  const tabChanged = current.tab !== next.tab;
  const filtersChanged = current.sort !== next.sort || current.q !== next.q || current.view !== next.view;
  return tabChanged || filtersChanged ? { ...next, page: 1 } : next;
}
