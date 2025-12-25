import Link from "next/link";

type HotTagsProps = {
  tags: { slug: string; count: number }[];
};

export default function HotTags({ tags }: HotTagsProps) {
  return (
    <div className="rounded-[var(--radius)] border border-border/70 bg-background/60 p-4">
      <div className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">
        Hot Tags
      </div>
      <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
        {tags.slice(0, 12).map((tag) => (
          <Link
            key={tag.slug}
            href={`/search?tags=${tag.slug}`}
            className="flex items-center justify-between rounded-md border border-transparent px-2 py-1 transition hover:border-primary/30 hover:bg-card/60"
          >
            <span>{tag.slug}</span>
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/70">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
