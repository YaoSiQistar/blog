import Link from "next/link";

import Container from "@/components/shell/Container";
import PageHeader from "@/components/shell/PageHeader";
import { RuleLine } from "@/components/editorial/RuleLine";
import Kicker from "@/components/editorial/Kicker";
import CatalogList from "@/components/catalog/CatalogList";
import {
  getAllCategories,
  getAllTags,
  getPostsPaged,
} from "@/lib/content";
import { normalizeSearchParams } from "@/lib/content/searchParams";

interface ContentDemoPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContentDemoPage({
  searchParams,
}: ContentDemoPageProps) {
  const resolvedSearchParams = await searchParams;
  const params = normalizeSearchParams(resolvedSearchParams);
  const [paged, categories, tags] = await Promise.all([
    getPostsPaged(params),
    getAllCategories(),
    getAllTags(),
  ]);

  const listItems = paged.items.map((item) => ({
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    category: item.category,
    date: item.date,
    readingTime: item.readingTime,
  }));

  const buildHref = (
    overrides: Partial<typeof params>,
    options: { resetPage?: boolean } = {}
  ) => {
    const next = {
      ...params,
      ...overrides,
      page: options.resetPage ? 1 : overrides.page ?? params.page,
    };
    const sp = new URLSearchParams();

    if (next.page > 1) sp.set("page", String(next.page));
    if (next.category) sp.set("category", next.category);
    if (next.tags.length > 0) sp.set("tags", next.tags.join(","));
    if (next.sort !== "latest") sp.set("sort", next.sort);
    if (next.q) sp.set("q", next.q);

    const qs = sp.toString();
    return qs ? `/content-demo?${qs}` : "/content-demo";
  };

  const renderTime = new Date().toISOString();

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide">
        <PageHeader
          label="Content demo"
          title="Markdown content as the single source of truth"
          description="This page verifies indexing, filtering, pagination, and draft handling against content/ posts."
        />

        <RuleLine className="mb-8" />

        <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <form
              className="flex flex-wrap items-end gap-3 rounded-[var(--radius)] border border-border bg-card/70 p-4"
              action="/content-demo"
              method="get"
            >
              {params.category && (
                <input type="hidden" name="category" value={params.category} />
              )}
              {params.tags.length > 0 && (
                <input type="hidden" name="tags" value={params.tags.join(",")} />
              )}
              <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                <label className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                  Search
                </label>
                <input
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Search title or content"
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                  Sort
                </label>
                <select
                  name="sort"
                  defaultValue={params.sort}
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
              <button
                type="submit"
                className="h-9 rounded-md border border-border bg-primary px-4 text-xs uppercase tracking-[0.3em] text-primary-foreground"
              >
                Apply
              </button>
            </form>

            <div className="rounded-[var(--radius)] border border-border bg-card/70 p-4">
              <Kicker label="Results" caption={`${paged.total} posts`} />
              {listItems.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No posts match the current filters.
                </p>
              ) : (
                <CatalogList items={listItems} className="mt-4" />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {paged.page} of {paged.totalPages}
              </span>
              <div className="flex gap-3">
                {paged.page > 1 ? (
                  <Link
                    href={buildHref({ page: paged.page - 1 })}
                    className="text-primary"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-muted-foreground/60">Previous</span>
                )}
                {paged.page < paged.totalPages ? (
                  <Link
                    href={buildHref({ page: paged.page + 1 })}
                    className="text-primary"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="text-muted-foreground/60">Next</span>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[var(--radius)] border border-border bg-card/70 p-4">
              <Kicker label="Category" caption="Filter" />
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Link
                  href={buildHref({ category: undefined }, { resetPage: true })}
                  className={
                    params.category
                      ? "rounded-full border border-border px-3 py-1 text-muted-foreground"
                      : "rounded-full border border-primary px-3 py-1 text-primary"
                  }
                >
                  All
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildHref({ category: item.slug }, { resetPage: true })}
                    className={
                      params.category === item.slug
                        ? "rounded-full border border-primary px-3 py-1 text-primary"
                        : "rounded-full border border-border px-3 py-1 text-muted-foreground"
                    }
                  >
                    {item.slug} ({item.count})
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-border bg-card/70 p-4">
              <Kicker label="Tags" caption="Toggle" />
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {tags.map((tag) => {
                  const isActive = params.tags.includes(tag.slug);
                  const nextTags = isActive
                    ? params.tags.filter((item) => item !== tag.slug)
                    : [...params.tags, tag.slug];
                  return (
                    <Link
                      key={tag.slug}
                      href={buildHref({ tags: nextTags }, { resetPage: true })}
                      className={
                        isActive
                          ? "rounded-full border border-primary px-3 py-1 text-primary"
                          : "rounded-full border border-border px-3 py-1 text-muted-foreground"
                      }
                    >
                      {tag.slug} ({tag.count})
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>

        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          Server render time: {renderTime}
        </p>
      </Container>
    </main>
  );
}
