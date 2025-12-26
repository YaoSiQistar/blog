import { getAllPostsIndex, getAllTags } from "@/lib/content";
import { slugRegex } from "@/lib/content/schema";

const toTitle = (value: string) =>
  value
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");

export async function getTagBySlug(slug: string) {
  if (!slugRegex.test(slug)) return null;

  const tags = await getAllTags();
  const entry = tags.find((tag) => tag.slug === slug);
  if (!entry) return null;

  const posts = await getAllPostsIndex();
  let latestTimestamp = 0;
  let latestDate: string | undefined;

  posts.forEach((post) => {
    if (!post.tags.includes(slug)) return;
    if (post.dateTimestamp > latestTimestamp) {
      latestTimestamp = post.dateTimestamp;
      latestDate = post.date;
    }
  });

  return {
    slug,
    name: toTitle(slug),
    count: entry.count,
    latestDate,
  };
}
