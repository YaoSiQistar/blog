import { getAllPostsIndex } from "@/lib/content";
import { slugRegex } from "@/lib/content/schema";
import { buildCategoryMap } from "./mapModel";

const buildCategoryDescription = (name: string) =>
  `A curated room of essays and notes exploring ${name} through craft, references, and quiet systems.`;

export async function getCategoryBySlug(slug: string) {
  if (!slugRegex.test(slug)) return null;
  const posts = await getAllPostsIndex();
  const { nodes } = buildCategoryMap(posts);
  const node = nodes.find((item) => item.slug === slug);
  if (!node) return null;

  return {
    ...node,
    description: node.description ?? buildCategoryDescription(node.name),
  };
}
