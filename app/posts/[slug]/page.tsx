import { notFound } from "next/navigation";
import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import PostHero from "@/components/posts/PostHero";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { parseHeadings } from "@/lib/markdown/parseHeadings";
import { buildHeadingNodes } from "@/lib/posts/kintsug";
import { getPostBySlug } from "@/lib/content";
import { KintsugRail } from "@/components/Kintsug/KintsugiRail";

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PostDetailPage({ params, searchParams }: PostDetailPageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const headings = parseHeadings(post.content);
  const kintsugNodes = buildHeadingNodes(headings);

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
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
          <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-[6.75rem]">
                <KintsugRail
                  nodes={kintsugNodes}
                  mode="reading"
                  containerSelector="#article"
                  variant="compact"
                  spacing={32}
                />
              </div>
            </aside>

            <div className="space-y-10">
              <MarkdownRenderer markdown={post.content} />
              <section className="rounded-[var(--radius)] border border-border bg-card/60 p-6 text-sm text-muted-foreground">
                Engagement placeholder (likes / favorites / comments).
              </section>
            </div>
          </div>

          <aside className="space-y-6">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </Container>
    </main>
  );
}
