"use client";

import AnimatedLink from "@/components/motion/AnimatedLink";
import { useMarkdownContext } from "./MarkdownContext";
import { cn } from "@/lib/utils";

type PostCardEmbedProps = {
  slug?: string;
  className?: string;
};

export function PostCardEmbed(props?: PostCardEmbedProps | null) {
  const safeProps = props ?? {};
  const { slug, className } = safeProps;
  const context = useMarkdownContext();
  if (!slug || !context) return null;

  const post = context.postIndex.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className={cn("markdown-post-embed", className)}>
        <div className="rounded-[var(--radius)] border border-dashed border-border/70 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
          Missing post: {slug}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("markdown-post-embed", className)}>
      <AnimatedLink
        href={`/posts/${post.slug}`}
        className="flex w-full flex-col gap-2 rounded-[var(--radius)] border border-border/70 bg-card/70 p-4"
      >
        <div className="text-xs uppercase tracking-[0.32em] text-muted-foreground">{post.date}</div>
        <div className="text-lg font-semibold text-foreground">{post.title}</div>
        <div className="text-sm text-muted-foreground">{post.excerpt}</div>
      </AnimatedLink>
    </div>
  );
}
