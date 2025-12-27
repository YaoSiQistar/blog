import Link from "next/link";

type CategoryEmptyProps = {
  variant: "empty" | "filtered";
  clearHref: string;
  backHref: string;
  postsHref: string;
};

export default function CategoryEmpty({
  variant,
  clearHref,
  backHref,
  postsHref,
}: CategoryEmptyProps) {
  const isEmpty = variant === "empty";
  return (
    <section className="rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
        {isEmpty ? "展厅为空" : "无匹配结果"}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">
        {isEmpty ? "该展厅暂无内容。" : "当前筛选无结果。"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isEmpty
          ? "返回展厅列表或浏览完整归档。"
          : "尝试其他关键词或清除下方筛选。"}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.35em]">
        <Link
          href={clearHref}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          清除筛选
        </Link>
        <Link
          href={backHref}
          className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          返回展厅
        </Link>
        <Link
          href={postsHref}
          className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-foreground"
        >
          浏览全部文章
        </Link>
      </div>
    </section>
  );
}
