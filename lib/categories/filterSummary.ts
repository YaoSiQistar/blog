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
    return `在 ${categoryName} 中搜索“${q}”`;
  }

  if (tags.length > 0) {
    const tagLabel =
      tags.length <= 2 ? tags.join(" / ") : `${tags[0]} +${tags.length - 1}`;
    return `按 ${tagLabel} 筛选 · 排序 ${sort === "latest" ? "最新" : "热门"}`;
  }

  const updated = latestDate ? ` · 更新于 ${latestDate}` : "";
  return `${totalCount} 篇${updated}`;
}
