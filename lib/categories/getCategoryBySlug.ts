import { getAllPostsIndex } from "@/lib/content";
import { slugRegex } from "@/lib/content/schema";
import { buildCategoryMap } from "./mapModel";

const buildCategoryDescription = (name: string) =>
  `以工艺、参考与安静的系统为线索，探索 ${name} 的策展式房间。`;

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
