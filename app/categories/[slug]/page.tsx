import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import CatalogList from "@/components/catalog/CatalogList";
import PostsPagination from "@/components/pagination/Pagination";
import CategoryTopBar from "@/components/category/CategoryTopBar";
import CategoryHero from "@/components/category/CategoryHero";
import CategoryWorkbench from "@/components/category/CategoryWorkbench";
import CategoryEmpty from "@/components/category/CategoryEmpty";
import CategoryExitSigns from "@/components/category/CategoryExitSigns";
import Stacking3D from "@/components/motion/Stacking3D";
import { getAllCategories, getPostsPaged } from "@/lib/content";
import { getCategoryBySlug } from "@/lib/categories/getCategoryBySlug";
import { getTagsForCategory } from "@/lib/categories/getTagsForCategory";
import {
  buildCategoryHref,
  parseCategoryParams,
} from "@/lib/categories/searchParams";
import { buildGallerySummary } from "@/lib/categories/filterSummary";
import { buildPageMetadata } from "@/lib/seo/og";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

const PAGE_SIZE = 8;

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  if (!category) return {};

  return buildPageMetadata({
    title: category.name,
    description: category.description ?? "",
    pathname: `/categories/${category.slug}`,
  });
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);
  const slug = resolvedParams.slug;
  const state = parseCategoryParams(resolvedSearch);
  const [category, tagsInCategory] = await Promise.all([
    getCategoryBySlug(slug),
    getTagsForCategory(slug, { limit: 20 }),
  ]);

  if (!category) {
    notFound();
  }

  const allowedTags = new Set(tagsInCategory.map((tag) => tag.slug));
  const safeTags = state.tags.filter((tag) => allowedTags.has(tag));
  const safeState = { ...state, tags: safeTags };

  const paged = await getPostsPaged({
    category: slug,
    page: safeState.page,
    pageSize: PAGE_SIZE,
    sort: safeState.sort,
    tags: safeState.tags,
    q: safeState.q,
  });

  const summary = buildGallerySummary({
    categoryName: category.name,
    totalCount: category.count,
    latestDate: category.latestDate,
    q: safeState.q,
    tags: safeState.tags,
    sort: safeState.sort,
  });

  const catalogItems = paged.items.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    readingTime: post.readingTime,
    tags: post.tags,
    cover: post.cover,
  }));

  const stackCards = paged.items.slice(0, 3).map((post) => ({
    id: post.slug,
    title: post.title,
    subtitle: post.excerpt,
  }));

  const view = getParam(resolvedSearch, "view");
  const backHref = view ? `/categories?view=${view}` : "/categories";
  const clearHref = buildCategoryHref(slug, {
    page: 1,
    sort: "latest",
    tags: [],
    q: undefined,
  });

  const hasResults = catalogItems.length > 0;
  const emptyVariant = category.count === 0 ? "empty" : "filtered";

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <CategoryTopBar categoryName={category.name} backHref={backHref} />
        <CategoryHero
          name={category.name}
          description={category.description ?? ""}
          summary={summary}
          count={category.count}
          latestDate={category.latestDate}
        />
      </Container>

      {stackCards.length > 0 ? (
        <Container variant="wide" className="space-y-6">
          <RuleLine />
          <Stacking3D cards={stackCards} />
        </Container>
      ) : null}

      <Container variant="wide" className="space-y-6">
        <RuleLine />
        <CategoryWorkbench slug={slug} tags={tagsInCategory} />
      </Container>

      <Container variant="wide" className="space-y-6">
        <RuleLine />
        {hasResults ? (
          <CatalogList
            items={catalogItems}
            stagger
            startIndex={(paged.page - 1) * paged.pageSize}
          />
        ) : (
          <CategoryEmpty
            variant={emptyVariant}
            clearHref={clearHref}
            backHref={backHref}
            postsHref="/posts"
          />
        )}

        <div className="flex items-center justify-between pt-6 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          <span>
            第 {paged.page} / {paged.totalPages} 页
          </span>
          <span>{paged.total} 篇</span>
        </div>

        <PostsPagination
          currentPage={paged.page}
          totalPages={paged.totalPages}
          createHref={(page) => buildCategoryHref(slug, { ...safeState, page })}
        />
      </Container>

      <Container variant="wide">
        <RuleLine className="mb-6" />
        <CategoryExitSigns />
      </Container>
    </main>
  );
}
