import Link from "next/link";

export default function CategoryExitSigns() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Link
        href="/categories"
        className="group rounded-[var(--radius)] border border-border bg-card/70 p-6 transition hover:border-primary/60 hover:bg-card/90"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">
          出口
        </p>
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
          返回展厅
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          返回博物馆地图继续浏览。
        </p>
      </Link>
      <Link
        href="/posts"
        className="group rounded-[var(--radius)] border border-border bg-card/70 p-6 transition hover:border-primary/60 hover:bg-card/90"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">
          归档
        </p>
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
          浏览全部文章
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          不使用展厅筛选，直接查看完整目录。
        </p>
      </Link>
    </section>
  );
}
