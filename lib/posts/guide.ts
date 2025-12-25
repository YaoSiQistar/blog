import type { NormalizedSearchParams } from "@/lib/content/searchParams";
import type { PostSort } from "@/lib/content/types";

export type GuideModel = {
  currentCategory?: string;
  selectedTags: string[];
  q?: string;
  sort: PostSort;
  page: number;
  resultsCount: number;
  totalPages: number;
  filterSummarySentence: string;
};

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function buildGuideModel(
  params: NormalizedSearchParams,
  resultsCount: number,
  totalPages: number
): GuideModel {
  const parts: string[] = [];

  if (params.category) {
    parts.push(`Gallery: ${titleCase(params.category)}`);
  }

  if (params.tags.length > 0) {
    parts.push(`Tags: ${params.tags.join(", ")}`);
  }

  if (params.q) {
    parts.push(`Search: ${params.q}`);
  }

  const resultsLabel = `${resultsCount} ${resultsCount === 1 ? "result" : "results"}`;
  const filterSummarySentence =
    parts.length > 0 ? `${parts.join(" · ")} · ${resultsLabel}` : `All galleries · ${resultsLabel}`;

  return {
    currentCategory: params.category,
    selectedTags: params.tags,  
    q: params.q,
    sort: params.sort,
    page: params.page,
    resultsCount,
    totalPages,
    filterSummarySentence,
  };
}
