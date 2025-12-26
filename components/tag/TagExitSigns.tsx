import Link from "next/link";

export default function TagExitSigns() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Link
        href="/tags"
        className="group rounded-[var(--radius)] border border-border bg-card/70 p-6 transition hover:border-primary/60 hover:bg-card/90"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">Exit</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
          Browse all tags
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Return to the topic wall and open another dossier.
        </p>
      </Link>
      <Link
        href="/posts"
        className="group rounded-[var(--radius)] border border-border bg-card/70 p-6 transition hover:border-primary/60 hover:bg-card/90"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">Archive</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
          Browse all posts
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore the full catalog without tag filters.
        </p>
      </Link>
    </section>
  );
}
