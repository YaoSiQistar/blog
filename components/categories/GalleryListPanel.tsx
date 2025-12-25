"use client";

import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/lib/categories/mapModel";

type GalleryListPanelProps = {
  items: CategoryNode[];
  activeSlug?: string | null;
  selectedSlug?: string | null;
  scrollTargetSlug?: string | null;
  onHover?: (slug: string | null) => void;
  className?: string;
};

export default function GalleryListPanel({
  items,
  activeSlug,
  selectedSlug,
  scrollTargetSlug,
  onHover,
  className,
}: GalleryListPanelProps) {
  const itemRefs = React.useRef(new Map<string, HTMLAnchorElement | null>());

  React.useEffect(() => {
    if (!scrollTargetSlug) return;
    const node = itemRefs.current.get(scrollTargetSlug);
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [scrollTargetSlug]);

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border bg-card/70 p-4",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-muted-foreground/70">
          Gallery Index
        </p>
        <h2 className="text-sm font-semibold text-foreground">Exhibition List</h2>
      </div>

      <div
        className="mt-4 max-h-[70vh] space-y-2 overflow-auto pr-2"
        onPointerLeave={() => onHover?.(null)}
      >
        {items.map((item) => {
          const isActive = item.slug === activeSlug || item.slug === selectedSlug;
          return (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}`}
              ref={(node) => {
                itemRefs.current.set(item.slug, node);
              }}
              onMouseEnter={() => onHover?.(item.slug)}
              onFocus={() => onHover?.(item.slug)}
              className={cn(
                "group flex flex-col gap-2 rounded-[var(--radius)] border px-3 py-3 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isActive
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border-subtle bg-background/50 text-muted-foreground hover:border-primary/50"
              )}
              aria-current={item.slug === selectedSlug ? "page" : undefined}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.4em] text-muted-foreground/70">
                    Gallery
                  </p>
                  <p className="text-base font-semibold text-foreground/90 group-hover:text-foreground">
                    {item.name}
                  </p>
                  {item.latestDate ? (
                    <p className="mt-1 text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                      Latest {item.latestDate}
                    </p>
                  ) : null}
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                  {item.count}
                </span>
              </div>
              {item.topTags && item.topTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/60">
                  {item.topTags.map((tag) => (
                    <span key={`${item.slug}-${tag}`} className="rounded-full border border-border/60 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
