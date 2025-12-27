import Link from "next/link";

import { cn } from "@/lib/utils";

export type TagItem = {
  slug: string;
  count: number;
};

type TagGalleryProps = {
  tags: TagItem[];
  className?: string;
  compact?: boolean;
};

export default function TagGallery({ tags, className, compact }: TagGalleryProps) {
  if (!tags.length) {
    return (
      <p className="text-sm text-muted-foreground">
        当前分组暂无标签。
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        compact && "lg:grid-cols-2 2xl:grid-cols-3",
        className
      )}
    >
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/tags/${tag.slug}`}
          className="group rounded-[var(--radius)] border border-border bg-card/70 px-4 py-3 transition hover:border-primary/40 hover:bg-card"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-foreground">
              {tag.slug}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/70">
              {tag.count}
            </span>
          </div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/60">
            归档标签
          </div>
        </Link>
      ))}
    </div>
  );
}
