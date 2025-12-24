import { notFound } from "next/navigation";

import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import PostHero from "@/components/posts/PostHero";
import { getPostBySlug } from "@/lib/content";

interface PostDetailPageProps {
  params: { slug: string };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="prose">
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

        <RuleLine className="my-8" />

        <section className="rounded-[var(--radius)] border border-border bg-card/60 p-6 text-sm text-muted-foreground">
          Markdown rendering placeholder. P7 will replace this block with the
          full renderer and table of contents.
        </section>

        <section className="rounded-[var(--radius)] border border-border bg-card/60 p-6 text-sm text-muted-foreground">
          Engagement placeholder (likes / favorites / comments).
        </section>
      </Container>
    </main>
  );
}
