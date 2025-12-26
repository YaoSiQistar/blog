"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";

import CatalogList from "@/components/catalog/CatalogList";
import RemoveFavoriteButton from "@/components/me/RemoveFavoriteButton";
import type { FavoriteEntry } from "@/lib/me/favorites";
import type { DossierView } from "@/lib/me/query";

type FavoritesListProps = {
  items: FavoriteEntry[];
  view: DossierView;
};

const formatSavedAt = (value: string) => {
  try {
    return format(parseISO(value), "MMM dd, yyyy");
  } catch {
    return value;
  }
};

export default function FavoritesList({ items, view }: FavoritesListProps) {
  const [entries, setEntries] = React.useState(items);

  React.useEffect(() => {
    setEntries(items);
  }, [items]);

  const handleRemove = (slug: string) => {
    setEntries((prev) => prev.filter((entry) => entry.slug !== slug));
  };

  const handleUndo = (entry: FavoriteEntry, index: number) => {
    setEntries((prev) => {
      if (prev.some((item) => item.slug === entry.slug)) return prev;
      const next = [...prev];
      next.splice(index, 0, entry);
      return next;
    });
  };

  const catalogItems = entries.map((entry, index) => ({
    title: entry.title,
    slug: entry.slug,
    excerpt: entry.excerpt,
    category: entry.category,
    date: entry.date,
    readingTime: entry.readingTime,
    tags: entry.tags,
    cover: entry.cover,
    supplemental: (
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em]">
          Saved {formatSavedAt(entry.savedAt)}
        </span>
        <RemoveFavoriteButton
          postSlug={entry.slug}
          onRemove={() => handleRemove(entry.slug)}
          onUndo={() => handleUndo(entry, index)}
        />
      </div>
    ),
  }));

  return (
    <CatalogList
      items={catalogItems}
      stagger
      className={view === "compact" ? "space-y-3" : "space-y-5"}
    />
  );
}
