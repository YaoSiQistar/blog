import CatalogList from "@/components/catalog/CatalogList";
import { RuleLine } from "@/components/editorial/RuleLine";
import PostsPagination from "@/components/pagination/Pagination";
import EditorialWorkbench from "@/components/posts/EditorialWorkbench";
import GuideDrawer from "@/components/posts/GuideDrawer";
import { GuideRail } from "@/components/guide/GuideRail";
import MuseumGuidePanel from "@/components/posts/MuseumGuidePanel";
import PostsLayout from "@/components/posts/PostsLayout";
import PostsPageHeader from "@/components/posts/PostsPageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllCategories, getAllTags, getPostsPaged } from "@/lib/content";
import { normalizeSearchParams } from "@/lib/content/searchParams";
import { buildGuideModel } from "@/lib/posts/guide";
import type { GuideNode } from "@/lib/guide-rail/types";

interface PostsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = normalizeSearchParams(searchParams, { pageSize: 8 });
  const [paged, categories, tags] = await Promise.all([
    getPostsPaged(params),
    getAllCategories(),
    getAllTags(),
  ]);

  const guideModel = buildGuideModel(params, paged.total, paged.totalPages);
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

  const buildHref = (page: number) => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.tags.length > 0) query.set("tags", params.tags.join(","));
    if (params.q) query.set("q", params.q);
    if (params.sort !== "latest") query.set("sort", params.sort);
    if (page > 1) query.set("page", String(page));
    const qs = query.toString();
    return qs.length > 0 ? `/posts?${qs}` : "/posts";
  };

  const guideNodes: GuideNode[] = [
    {
      id: "posts-header",
      label: "Header",
      kind: "section",
      target: { type: "scroll", selector: "#posts-header" },
      meta: { subtitle: guideModel.filterSummarySentence },
    },
    {
      id: "posts-workbench",
      label: "Workbench",
      kind: "section",
      target: { type: "scroll", selector: "#posts-workbench" },
      meta: { subtitle: "Filters + search" },
    },
    {
      id: "posts-catalog",
      label: "Catalog",
      kind: "section",
      target: { type: "scroll", selector: "#posts-catalog" },
      meta: { subtitle: `${guideModel.resultsCount} works` },
    },
    {
      id: "posts-pagination",
      label: "Pages",
      kind: "section",
      target: { type: "scroll", selector: "#posts-pagination" },
      meta: { subtitle: `Page ${guideModel.page} / ${guideModel.totalPages}` },
    },
  ];

  return (
    <PostsLayout
      contentId="posts-content"
      left={
        <GuideRail
          nodes={guideNodes}
          mode="index"
          containerSelector="#posts-content"
          variant="rail"
        />
      }
      right={<MuseumGuidePanel categories={categories} tags={tags} />}
      mobileControls={<GuideDrawer categories={categories} tags={tags} />}
    >
      <section id="posts-header">
        <PostsPageHeader
          title="The Archive Catalog"
          description="A curated wall of editorial notes, arranged like a museum inventory of ink and motion."
          summary={guideModel.filterSummarySentence}
          resultsCount={guideModel.resultsCount}
          totalPages={guideModel.totalPages}
        />
      </section>

      <section id="posts-workbench">
        <EditorialWorkbench tags={tags} />
      </section>

      <RuleLine className="my-6" />

      <section id="posts-catalog">
        {catalogItems.length > 0 ? (
          <CatalogList items={catalogItems} stagger />
        ) : (
          <section className="rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center">
            <p className="text-lg font-semibold text-foreground">
              No works in this gallery.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try clearing filters or returning to the full catalog.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="secondary">
                <Link href="/posts">Clear filters</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/posts">Back to all</Link>
              </Button>
            </div>
          </section>
        )}
      </section>

      <section id="posts-pagination">
        <div className="flex items-center justify-between pt-6 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          <span>
            Page {guideModel.page} of {guideModel.totalPages}
          </span>
          <span>{guideModel.resultsCount} works</span>
        </div>

        <PostsPagination
          currentPage={guideModel.page}
          totalPages={guideModel.totalPages}
          createHref={buildHref}
        />
      </section>

      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
        The archive updates with every new note. Return often to discover new
        galleries.
      </p>
    </PostsLayout>
  );
}
