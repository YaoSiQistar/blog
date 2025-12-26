import { notFound } from "next/navigation";
import type { Metadata } from "next";
import path from "path";
import { promises as fs } from "fs";
import { Suspense } from "react";
import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import PostHero from "@/components/posts/PostHero";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { References } from "@/components/markdown/References";
import { parseHeadings } from "@/lib/markdown/parseHeadings";
import { getPostBySlug } from "@/lib/content";
import EngagementBar from "@/components/interaction/EngagementBar";
import CommentsSection from "@/components/interaction/CommentsSection";
import { getApprovedComments, getCounts, getViewerState } from "@/lib/engagement/queries";
import { getAnonKeyFromCookies } from "@/lib/anon/anonKey";
import { getServerUser } from "@/lib/auth/session";
import { getAllPostsIndex } from "@/lib/content";
import type { ReferenceEntry } from "@/lib/markdown/types";
import { buildOpenGraph, buildTwitter } from "@/lib/seo/og";
import { buildCanonical } from "@/lib/seo/site";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPostsIndex();
  return posts.slice(0, 50).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  const title = post.title;
  const description = post.excerpt;
  const pathname = `/posts/${post.slug}`;
  const image = post.cover ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonical(pathname),
    },
    openGraph: buildOpenGraph({
      title,
      description,
      pathname,
      image,
      type: "article",
    }),
    twitter: buildTwitter({ title, description, image }),
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const headings = parseHeadings(post.content);
  const [user, anonKey] = await Promise.all([getServerUser(), getAnonKeyFromCookies()]);
  const [counts, viewer, approvedComments, references] = await Promise.all([
    getCounts(post.slug),
    getViewerState(post.slug, { userId: user?.id, anonKey }),
    getApprovedComments(post.slug),
    loadPostReferences(post.references),
  ]);
  const postIndex = await getAllPostsIndex({ includeDrafts: true });
  const jsonLd = buildArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug: post.slug,
    cover: post.cover,
  });

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container variant="wide" className="space-y-6">
        <PostHero
          title={post.title}
          slug={post.slug}
          date={post.date}
          readingTime={post.readingTime}
          category={post.category}
          tags={post.tags}
          excerpt={post.excerpt}
          cover={post.cover}
        />
        <RuleLine className="my-4" />
      </Container>

      <ReadingProgress targetId="article" />

      <Container variant="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-10">
            <Suspense
              fallback={
                <div className="rounded-[var(--radius)] border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground">
                  Loading engagement...
                </div>
              }
            >
              <EngagementBar
                postSlug={post.slug}
                initialCounts={counts}
                initialViewer={viewer}
                isAuthenticated={Boolean(user?.id)}
              />
            </Suspense>
            <MarkdownRenderer
              markdown={post.content}
              features="ultra"
              postIndex={postIndex}
              references={references}
              paragraphAnchors
            />
            <References references={references} />
            <Suspense
              fallback={
                <div className="rounded-[var(--radius)] border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground">
                  Loading comments...
                </div>
              }
            >
              <CommentsSection
                postSlug={post.slug}
                initialComments={approvedComments}
                approvedCount={counts.commentsApproved}
                viewer={user?.id ? { userId: user.id } : undefined}
              />
            </Suspense>
          </div>

          <aside className="space-y-6">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </Container>
    </main>
  );
}

async function loadPostReferences(refPath?: string): Promise<ReferenceEntry[]> {
  if (!refPath) return [];
  const contentRoot = path.join(process.cwd(), "content");
  const resolved = path.resolve(contentRoot, refPath);
  if (!resolved.startsWith(contentRoot)) return [];
  try {
    const raw = await fs.readFile(resolved, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ReferenceEntry[]) : [];
  } catch {
    return [];
  }
}
