import { cn } from "@/lib/utils";

type MapLegendProps = {
  className?: string;
};

export default function MapLegend({ className }: MapLegendProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border/70 bg-card/70 px-4 py-3 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-border/70 px-2 py-1">Node size = posts</span>
        <span className="rounded-full border border-border/70 px-2 py-1">Lines = tag overlap</span>
      </div>
    </div>
  );
}
