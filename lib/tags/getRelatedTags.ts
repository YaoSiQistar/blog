import { getAllPostsIndex } from "@/lib/content";

const toTitle = (value: string) =>
  value
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");

export type RelatedTag = {
  slug: string;
  name: string;
  count: number;
};

export async function getRelatedTags(tagSlug: string, limit = 12): Promise<RelatedTag[]> {
  const posts = await getAllPostsIndex();
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    if (!post.tags.includes(tagSlug)) return;
    post.tags.forEach((tag) => {
      if (tag === tagSlug) return;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, count]) => ({ slug, name: toTitle(slug), count }));
}
