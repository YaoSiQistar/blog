import { getAllPostsIndex } from "@/lib/content";

type TagCount = {
  slug: string;
  count: number;
};

export async function getTagsForCategory(
  slug: string,
  options: { limit?: number } = {}
): Promise<TagCount[]> {
  const posts = await getAllPostsIndex();
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    if (post.category !== slug) return;
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  const limit = options.limit ?? 20;
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ slug: tag, count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.slug.localeCompare(b.slug)))
    .slice(0, limit);
}
