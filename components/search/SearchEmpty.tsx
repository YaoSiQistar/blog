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
        No Matches
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">
        No matches for "{query}"
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try different keywords or clear the filters below.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em]">
        <Link
          href={clearTags}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          Clear tags
        </Link>
        <Link
          href={clearCategory}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          Clear category
        </Link>
        <Link
          href={clearAll}
          className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-foreground"
        >
          Reset all
        </Link>
      </div>
    </section>
  );
}
