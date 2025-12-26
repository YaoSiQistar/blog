"use client";

import { format, parseISO } from "date-fns";

import AnimatedLink from "@/components/motion/AnimatedLink";
import { cn } from "@/lib/utils";

export type ActivityItem = {
  postSlug: string;
  title: string;
  excerpt?: string;
  createdAt: string;
  status?: string;
};

type ActivityListProps = {
  items: ActivityItem[];
  emptyLabel: string;
  className?: string;
};

const formatDate = (value: string) => {
  try {
    return format(parseISO(value), "MMM dd, yyyy");
  } catch {
    return value;
  }
};

export default function ActivityList({ items, emptyLabel, className }: ActivityListProps) {
  if (!items.length) {
    return (
      <div className={cn("rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => (
        <article
          key={`${item.postSlug}-${item.createdAt}`}
          className="rounded-[var(--radius)] border border-border bg-card/70 px-5 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>{formatDate(item.createdAt)}</span>
            {item.status ? <span>{item.status}</span> : null}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            <AnimatedLink href={`/posts/${item.postSlug}`}>{item.title}</AnimatedLink>
          </h3>
          {item.excerpt ? (
            <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
