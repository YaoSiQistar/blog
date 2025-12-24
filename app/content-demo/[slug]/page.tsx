import { notFound } from "next/navigation";

import Container from "@/components/shell/Container";
import PageHeader from "@/components/shell/PageHeader";
import { RuleLine } from "@/components/editorial/RuleLine";
import { getPostBySlug } from "@/lib/content";

interface ContentDemoDetailProps {
  params: { slug: string };
}

export default async function ContentDemoDetail({ params }: ContentDemoDetailProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="prose">
        <PageHeader
          label={post.category}
          title={post.title}
          description={post.excerpt}
        />

        <RuleLine className="mb-6" />

        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>{post.date}</span>
          <span>{post.readingTime}</span>
          <span>{post.tags.join(", ")}</span>
        </div>

        <article className="prose mt-6">
          {paragraphs.map((paragraph, index) => (
            <p key={`${post.slug}-${index}`}>{paragraph}</p>
          ))}
        </article>
      </Container>
    </main>
  );
}
