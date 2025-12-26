import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type CategoryTopBarProps = {
  categoryName: string;
  backHref: string;
};

export default function CategoryTopBar({ categoryName, backHref }: CategoryTopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Back to Galleries
      </Link>
      <span className="text-[0.6rem] uppercase tracking-[0.45em] text-muted-foreground/60">
        Galleries / {categoryName}
      </span>
    </div>
  );
}
