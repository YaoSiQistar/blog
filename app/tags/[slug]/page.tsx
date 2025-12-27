import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import CatalogList from "@/components/catalog/CatalogList";
import PostsPagination from "@/components/pagination/Pagination";
import TagTopBar from "@/components/tag/TagTopBar";
import TagHero from "@/components/tag/TagHero";
import TagContextStrip from "@/components/tag/TagContextStrip";
import TagWorkbench from "@/components/tag/TagWorkbench";
import TagEmpty from "@/components/tag/TagEmpty";
import TagExitSigns from "@/components/tag/TagExitSigns";
import { getAllTags } from "@/lib/content";
import { getTagBySlug } from "@/lib/tags/getTagBySlug";
import { getRelatedTags } from "@/lib/tags/getRelatedTags";
import { getPostsByTag } from "@/lib/tags/getPostsByTag";
import {
  buildTagHref,
  parseTagParams,
  MAX_WITH_TAGS,
} from "@/lib/tags/searchParams";
import { buildPageMetadata } from "@/lib/seo/og";

interface TagDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 8;

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

const buildTagDescription = (name: string) =>
  `归档于 ${name} 的笔记、文章与参考，被整理成安静的博客索引。`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = await getTagBySlug(resolvedParams.slug);
  if (!tag) return {};

  return buildPageMetadata({
    title: tag.name,
    description: buildTagDescription(tag.name),
    pathname: `/tags/${tag.slug}`,
  });
}

export default async function TagDetailPage({ params, searchParams }: TagDetailPageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug;
  const state = parseTagParams(resolvedSearch);
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const safeWith = state.with
    .filter((value) => value !== slug)
    .slice(0, MAX_WITH_TAGS);
  const safeState = { ...state, with: safeWith };

  const [relatedTags, paged] = await Promise.all([
    getRelatedTags(slug, 12),
    getPostsByTag({
      tag: slug,
      withTags: safeWith,
      q: safeState.q,
      sort: safeState.sort,
      page: safeState.page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const subtitle = `专题收录 ${paged.baseCount} 篇，归档于「${tag.name}」。`;
  const description = buildTagDescription(tag.name);

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

  const backHref = "/tags";
  const clearHref = buildTagHref(slug, {
    page: 1,
    sort: safeState.sort,
    with: [],
    q: undefined,
  });
  const currentHref = buildTagHref(slug, safeState);

  const hasResults = catalogItems.length > 0;
  const emptyVariant = paged.baseCount === 0 ? "empty" : "filtered";

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <TagTopBar tagName={tag.name} backHref={backHref} />
        <TagHero
          name={tag.name}
          subtitle={subtitle}
          description={description}
          count={paged.baseCount}
          latestDate={paged.latestDate}
        />
      </Container>

      <Container variant="wide" className="space-y-4">
        <RuleLine />
        <TagContextStrip
          tagSlug={tag.slug}
          tagName={tag.name}
          withTags={safeWith}
          q={safeState.q}
          clearHref={clearHref}
          currentHref={currentHref}
        />
      </Container>

      <Container variant="wide" className="space-y-6">
        <RuleLine />
        <TagWorkbench slug={slug} relatedTags={relatedTags} />
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
          <TagEmpty variant={emptyVariant} clearHref={clearHref} backHref={backHref} postsHref="/posts" />
        )}

        <div className="flex items-center justify-between pt-6 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          <span>
            第 {paged.page} 页 / 共 {paged.totalPages} 页
          </span>
          <span>{paged.total} 篇</span>
        </div>

        <PostsPagination
          currentPage={paged.page}
          totalPages={paged.totalPages}
          createHref={(page) => buildTagHref(slug, { ...safeState, page })}
        />
      </Container>

      <Container variant="wide">
        <RuleLine className="mb-6" />
        <TagExitSigns />
      </Container>
    </main>
  );
}
