import Link from "next/link";

import { buildSearchHref } from "@/lib/search/query";
import type { SearchQueryState } from "@/lib/search/types";

type SearchEmptyProps = {
  query: string;
  state: SearchQueryState;
};

export default function SearchEmpty({ query, state }: SearchEmptyProps) {
  const clearTags = buildSearchHref({ ...state, tags: [], page: 1 });
  const clearCategory = buildSearchHref({ ...state, category: undefined, page: 1 });
  const clearAll = buildSearchHref({
    q: undefined,
    page: 1,
    sort: "relevance",
    scope: "all",
    category: undefined,
    tags: [],
  });

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card/70 p-6">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
        无匹配结果
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">
        未找到“{query}”
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        尝试其他关键词或清除下方筛选。
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em]">
        <Link
          href={clearTags}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          清除标签
        </Link>
        <Link
          href={clearCategory}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          清除分类
        </Link>
        <Link
          href={clearAll}
          className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-foreground"
        >
          重置全部
        </Link>
      </div>
    </section>
  );
}
