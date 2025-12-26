import Link from "next/link";

type TagEmptyProps = {
  variant: "empty" | "filtered";
  clearHref: string;
  backHref: string;
  postsHref: string;
};

export default function TagEmpty({ variant, clearHref, backHref, postsHref }: TagEmptyProps) {
  const isEmpty = variant === "empty";
  return (
    <section className="rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
        {isEmpty ? "Dossier Empty" : "No Matches"}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">
        {isEmpty ? "No works filed under this tag." : "No matches for these filters."}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isEmpty
          ? "Return to the tag wall or browse the full archive."
          : "Try a different keyword or clear the filters below."}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.35em]">
        <Link
          href={clearHref}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          Clear filters
        </Link>
        <Link
          href={backHref}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          Back to tags
        </Link>
        <Link
          href={postsHref}
          className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-foreground"
        >
          Browse all posts
        </Link>
      </div>
    </section>
  );
}
