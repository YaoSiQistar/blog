import type { PostIndexItem } from "@/lib/content/types";
import { layoutCategoryNodes } from "./layout";
import { buildSimilarityEdges } from "./similarity";

export type CategoryNode = {
  slug: string;
  name: string;
  description?: string;
  count: number;
  latestDate?: string;
  topTags?: string[];
  x: number;
  y: number;
  size: number;
  cluster?: string;
};

export type CategoryEdge = {
  from: string;
  to: string;
  weight: number;
};

type CategoryAccumulator = {
  slug: string;
  name: string;
  count: number;
  latestDate?: string;
  latestTimestamp: number;
  tagCounts: Map<string, number>;
  tagSet: Set<string>;
  cluster: string;
};

const toTitle = (value: string) =>
  value
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");

const getClusterKey = (slug: string) => {
  const letter = slug.charAt(0).toUpperCase();
  return /^[A-Z]$/.test(letter) ? letter : "#";
};

const normalizeSize = (count: number, minCount: number, maxCount: number) => {
  if (maxCount === minCount) return 1;
  const normalized = (count - minCount) / (maxCount - minCount);
  return 0.4 + normalized * 0.6;
};

export function buildCategoryMap(posts: PostIndexItem[]) {
  const map = new Map<string, CategoryAccumulator>();

  posts.forEach((post) => {
    if (post.draft) return;
    const slug = post.category;
    if (!map.has(slug)) {
      map.set(slug, {
        slug,
        name: toTitle(slug),
        count: 0,
        latestDate: undefined,
        latestTimestamp: 0,
        tagCounts: new Map(),
        tagSet: new Set(),
        cluster: getClusterKey(slug),
      });
    }

    const entry = map.get(slug);
    if (!entry) return;
    entry.count += 1;

    if (post.dateTimestamp > entry.latestTimestamp) {
      entry.latestTimestamp = post.dateTimestamp;
      entry.latestDate = post.date;
    }

    post.tags.forEach((tag) => {
      entry.tagSet.add(tag);
      entry.tagCounts.set(tag, (entry.tagCounts.get(tag) ?? 0) + 1);
    });
  });

  const categories = Array.from(map.values()).sort((a, b) => b.count - a.count);
  const counts = categories.map((item) => item.count);
  const minCount = counts.length > 0 ? Math.min(...counts) : 0;
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;

  const layoutInput = categories.map((item) => ({
    slug: item.slug,
    size: normalizeSize(item.count, minCount, maxCount),
    cluster: item.cluster,
  }));
  const positions = layoutCategoryNodes(layoutInput);

  const nodes: CategoryNode[] = categories.map((item) => {
    const topTags = Array.from(item.tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag]) => tag);
    const position = positions.get(item.slug) ?? { x: 0.5, y: 0.5 };
    const size = normalizeSize(item.count, minCount, maxCount);

    return {
      slug: item.slug,
      name: item.name,
      count: item.count,
      latestDate: item.latestDate,
      topTags,
      x: position.x,
      y: position.y,
      size,
      cluster: item.cluster,
    };
  });

  const edges = buildSimilarityEdges(
    categories.map((item) => ({
      slug: item.slug,
      tags: Array.from(item.tagSet.values()),
    }))
  );

  return { nodes, edges };
}
