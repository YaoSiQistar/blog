import type { CategorySort } from "./searchParams";

type GallerySummaryParams = {
  categoryName: string;
  totalCount: number;
  latestDate?: string;
  q?: string;
  tags: string[];
  sort: CategorySort;
};

export function buildGallerySummary({
  categoryName,
  totalCount,
  latestDate,
  q,
  tags,
  sort,
}: GallerySummaryParams) {
  if (q) {
    return `Searching "${q}" in ${categoryName}`;
  }

  if (tags.length > 0) {
    const tagLabel =
      tags.length <= 2 ? tags.join(" / ") : `${tags[0]} +${tags.length - 1}`;
    return `Filtered by ${tagLabel} - Sorted ${sort}`;
  }

  const updated = latestDate ? ` - Updated ${latestDate}` : "";
  return `${totalCount} works${updated}`;
}
