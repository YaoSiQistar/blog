import path from "path";
import { promises as fs } from "fs";
import { unstable_cache } from "next/cache";

import type { SearchIndexItem } from "./types";

const INDEX_PATH = path.join(process.cwd(), "public", "search-index.json");

const readIndex = async (): Promise<SearchIndexItem[]> => {
  try {
    const raw = await fs.readFile(INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SearchIndexItem[]) : [];
  } catch {
    return [];
  }
};

export const getSearchIndex = unstable_cache(readIndex, ["search-index"], {
  revalidate: 3600,
});
