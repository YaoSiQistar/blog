import { getPostIndexBySlug } from "@/lib/content/postsIndex";
import { siteConfig } from "@/lib/seo/site";

export type PosterData = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  tags: string[];
  cover?: string;
  series?: string;
  issue?: string;
  readingTime?: string;
  category?: string;
  siteName: string;
  authorName: string;
};

export async function getPosterDataBySlug(slug: string): Promise<PosterData | null> {
  const post = await getPostIndexBySlug(slug, {
    includeDrafts: process.env.NODE_ENV !== "production",
  });
  if (!post) return null;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    tags: post.tags,
    cover: post.cover ?? undefined,
    series: post.series ?? undefined,
    issue: post.issue ?? undefined,
    readingTime: post.readingTime ?? undefined,
    category: post.category ?? undefined,
    siteName: siteConfig.siteName,
    authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME ?? "编辑部",
  };
}


