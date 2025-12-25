"use client";

const STORAGE_KEY = "search.recent";
const MAX_RECENT = 8;

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "string");
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function writeRecentSearches(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

export function addRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  const next = [query.trim(), ...readRecentSearches()]
    .filter((value) => value.length > 0)
    .filter((value, index, self) => self.indexOf(value) === index)
    .slice(0, MAX_RECENT);
  writeRecentSearches(next);
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
