import Link from "next/link";

import Container from "@/components/shell/Container";
import PageHeader from "@/components/shell/PageHeader";
import { RuleLine } from "@/components/editorial/RuleLine";
import CategoriesControls from "@/components/categories/CategoriesControls";
import MuseumMapLayout from "@/components/categories/MuseumMapLayout";
import { getAllPostsIndex } from "@/lib/content";
import { buildCategoryMap } from "@/lib/categories/mapModel";
import type { CategoryNode } from "@/lib/categories/mapModel";
import { buildPageMetadata } from "@/lib/seo/og";

export const metadata = buildPageMetadata({
  title: "分类",
  description: "以策展式展厅与编辑部房间探索归档内容。",
  pathname: "/categories",
});

interface CategoriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type ViewMode = "grid" | "list" | "map";

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

const parseView = (value?: string): ViewMode => {
  if (value === "list" || value === "map" || value === "grid") return value;
  return "grid";
};

function CategoryGrid({ items }: { items: CategoryNode[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-6 text-sm text-muted-foreground">
        暂无可用展厅。
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/categories/${item.slug}`}
          className="group flex h-full flex-col justify-between rounded-[var(--radius)] border border-border bg-card/70 p-5 transition hover:border-primary/60 hover:bg-card/90"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              <span>展厅</span>
              <span>{item.count}</span>
            </div>
            <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary">
              {item.name}
            </h3>
            {item.latestDate ? (
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                最新 {item.latestDate}
              </p>
            ) : null}
          </div>
          {item.topTags && item.topTags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/70">
              {item.topTags.map((tag) => (
                <span
                  key={`${item.slug}-${tag}`}
                  className="rounded-full border border-border/60 px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

function CategoryList({ items }: { items: CategoryNode[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-6 text-sm text-muted-foreground">
        暂无可用展厅。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/categories/${item.slug}`}
          className="group flex flex-wrap items-start justify-between gap-6 rounded-[var(--radius)] border border-border bg-card/70 px-5 py-4 transition hover:border-primary/60 hover:bg-card/90"
        >
          <div className="space-y-2">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">
              展厅
            </p>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">
              {item.name}
            </h3>
            {item.latestDate ? (
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/60">
                最新 {item.latestDate}
              </p>
            ) : null}
            {item.topTags && item.topTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/70">
                {item.topTags.map((tag) => (
                  <span
                    key={`${item.slug}-${tag}`}
                    className="rounded-full border border-border/60 px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
            {item.count} 篇
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const view = parseView(getParam(resolvedSearchParams, "view"));
  const posts = await getAllPostsIndex();
  const { nodes, edges } = buildCategoryMap(posts);
  const ordered = [...nodes].sort((a, b) => b.count - a.count);

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <PageHeader
          label="分类"
          title="博物馆展厅"
          description="像参观导览一样浏览归档内容，可切换到地图模式查看展厅布局。"
        />
        <RuleLine />
        <CategoriesControls total={nodes.length} />
      </Container>

      <Container variant="wide">
        {view === "map" ? (
          <MuseumMapLayout nodes={ordered} edges={edges} />
        ) : view === "list" ? (
          <CategoryList items={ordered} />
        ) : (
          <CategoryGrid items={ordered} />
        )}
      </Container>
    </main>
  );
}
