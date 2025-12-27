import CatalogList from "@/components/catalog/CatalogList";
import { RuleLine } from "@/components/editorial/RuleLine";
import PostsPagination from "@/components/pagination/Pagination";
import EditorialWorkbench from "@/components/posts/EditorialWorkbench";
import GuideDrawer from "@/components/posts/GuideDrawer";
import { KintsugRail } from "@/components/Kintsug/KintsugiRail";
import MuseumGuidePanel from "@/components/posts/MuseumGuidePanel";
import PostsLayout from "@/components/posts/PostsLayout";
import PostsPageHeader from "@/components/posts/PostsPageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllCategories, getAllPostsIndex, getAllTags, getPostsPaged } from "@/lib/content";
import { normalizeSearchParams } from "@/lib/content/searchParams";
import { buildGuideModel } from "@/lib/posts/Guide";
import type { KintsugNode } from "@/lib/Kintsug-rail/types";
import { buildPageMetadata } from "@/lib/seo/og";
import ScrollHorizontalGallery from "@/components/motion/ScrollHorizontalGallery";
import MotionExitSigns from "@/components/motion/MotionExitSigns";

export const metadata = buildPageMetadata({
  title: "Archive",
  description: "Browse the archive with editorial filters and catalog views.",
  pathname: "/posts",
});

export const revalidate = 60;

interface PostsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const resolvedParams = await searchParams;
  const params = normalizeSearchParams(resolvedParams, { pageSize: 8 });
  const [paged, categories, tags, index] = await Promise.all([
    getPostsPaged(params),
    getAllCategories(),
    getAllTags(),
    getAllPostsIndex(),
  ]);

  const GuideModel = buildGuideModel(params, paged.total, paged.totalPages);
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

  const featured = index.filter((item) => item.featured || item.pinned).slice(0, 8);
  const gallerySource = featured.length > 0 ? featured : index.slice(0, 8);
  const galleryItems = gallerySource.map((post) => ({
    id: post.slug,
    title: post.title,
    subtitle: post.excerpt,
    image: post.cover,
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

  const kintsugNodes: KintsugNode[] = [
    {
      id: "posts-header",
      label: "Header",
      kind: "section",
      target: { type: "scroll", selector: "#posts-header" },
      meta: { subtitle: GuideModel.filterSummarySentence },
    },
    {
      id: "posts-workbench",
      label: "Workbench",
      kind: "section",
      target: { type: "scroll", selector: "#posts-workbench" },
      meta: { subtitle: "Filters + Search" },
    },
    {
      id: "posts-catalog",
      label: "Catalog",
      kind: "section",
      target: { type: "scroll", selector: "#posts-catalog" },
      meta: { subtitle: `${GuideModel.resultsCount} posts` },
    },
    {
      id: "posts-pagination",
      label: "Pages",
      kind: "section",
      target: { type: "scroll", selector: "#posts-pagination" },
      meta: { subtitle: `Page ${GuideModel.page} / ${GuideModel.totalPages}` },
    },
  ];

  return (
    <PostsLayout
      contentId="posts-content"
      left={
        <KintsugRail
          nodes={kintsugNodes}
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
          title="Archive Catalog"
          description="Browse editorial notes and motion logs through a museum-style list."
          summary={GuideModel.filterSummarySentence}
          resultsCount={GuideModel.resultsCount}
          totalPages={GuideModel.totalPages}
        />
      </section>

      <section id="posts-featured">
        <ScrollHorizontalGallery items={galleryItems} snapOnMobile endCap />
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
            <p className="text-lg font-semibold text-foreground">No entries yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Clear filters or return to the full catalog.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="secondary">
                <Link href="/posts">Clear filters</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/posts">View all</Link>
              </Button>
            </div>
          </section>
        )}
      </section>

      <section id="posts-pagination">
        <div className="flex items-center justify-between pt-6 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          <span>
            Page {GuideModel.page} / {GuideModel.totalPages}
          </span>
          <span>{GuideModel.resultsCount} posts</span>
        </div>

        <PostsPagination
          currentPage={GuideModel.page}
          totalPages={GuideModel.totalPages}
          createHref={buildHref}
        />
      </section>

      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
        The archive grows with each new entry. Check back for fresh exhibits.
      </p>
      <MotionExitSigns />
    </PostsLayout>
  );
}