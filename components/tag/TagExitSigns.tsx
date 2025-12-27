import Link from "next/link";

export default function TagExitSigns() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Link
        href="/tags"
        className="group rounded-[var(--radius)] border border-border bg-card/70 p-6 transition hover:border-primary/60 hover:bg-card/90"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">出口</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
          浏览全部标签
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          返回主题墙并打开另一个专题。
        </p>
      </Link>
      <Link
        href="/posts"
        className="group rounded-[var(--radius)] border border-border bg-card/70 p-6 transition hover:border-primary/60 hover:bg-card/90"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">归档</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
          浏览全部文章
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          不使用标签筛选，直接查看完整目录。
        </p>
      </Link>
    </section>
  );
}
