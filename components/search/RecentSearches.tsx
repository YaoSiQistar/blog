"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { buildSearchHref } from "@/lib/search/query";
import { clearRecentSearches, readRecentSearches } from "@/lib/search/recent";

export default function RecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readRecentSearches());
  }, []);

  const handleClear = () => {
    clearRecentSearches();
    setRecent([]);
  };

  return (
    <div className="rounded-[var(--radius)] border border-border/70 bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">
          Recent
        </div>
        {recent.length > 0 ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent searches yet.</p>
        ) : (
          recent.map((term) => (
            <Link
              key={term}
              href={buildSearchHref({ q: term })}
              className="rounded-md border border-transparent px-2 py-1 transition hover:border-primary/30 hover:bg-card/60"
            >
              {term}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
