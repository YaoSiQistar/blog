import Link from "next/link";

import RecentSearches from "@/components/search/RecentSearches";
import HotTags from "@/components/search/HotTags";

type SearchWelcomeProps = {
  tags: { slug: string; count: number }[];
  categories: { slug: string; count: number }[];
};

export default function SearchWelcome({ tags, categories }: SearchWelcomeProps) {
  return (
    <section className="rounded-[var(--radius)] border border-border bg-card/70 p-6">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
          索引欢迎
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          输入关键词以打开归档。
        </h2>
        <p className="text-sm text-muted-foreground">
          可查看最近搜索、进入热门标签，或按分类筛选开始。
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <RecentSearches />
        <HotTags tags={tags} />
        <div className="rounded-[var(--radius)] border border-border/70 bg-background/60 p-4">
          <div className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">
            分类
          </div>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/search?category=${category.slug}`}
                className="flex items-center justify-between rounded-md border border-transparent px-2 py-1 transition hover:border-primary/30 hover:bg-card/60"
              >
                <span>{category.slug}</span>
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/70">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-6 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
        提示：可用范围与排序进一步优化结果。
      </p>
    </section>
  );
}
