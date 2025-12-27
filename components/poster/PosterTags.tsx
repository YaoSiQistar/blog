import { posterConfig } from "@/lib/poster/config";
import { cn } from "@/lib/utils";

type PosterTagsProps = {
  tags: string[];
  className?: string;
};

export default function PosterTags({ tags, className }: PosterTagsProps) {
  if (!tags.length) return null;

  const max = posterConfig.tagsMax;
  const visible = tags.slice(0, max);
  const extra = Math.max(0, tags.length - visible.length);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {visible.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground"
        >
          {tag}
        </span>
      ))}
      {extra > 0 ? (
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
