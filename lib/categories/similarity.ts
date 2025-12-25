import type { CategoryEdge } from "./mapModel";

type SimilarityNode = {
  slug: string;
  tags: string[];
};

const intersectCount = (a: Set<string>, b: Set<string>) => {
  let count = 0;
  a.forEach((value) => {
    if (b.has(value)) count += 1;
  });
  return count;
};

const jaccard = (a: Set<string>, b: Set<string>) => {
  const intersection = intersectCount(a, b);
  if (intersection === 0) return 0;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

export function buildSimilarityEdges(
  nodes: SimilarityNode[],
  maxEdgesPerNode = 3,
  minWeight = 0.08
): CategoryEdge[] {
  const tagSets = nodes.map((node) => ({
    slug: node.slug,
    tags: new Set(node.tags),
  }));

  const pairs: CategoryEdge[] = [];

  for (let i = 0; i < tagSets.length; i += 1) {
    for (let j = i + 1; j < tagSets.length; j += 1) {
      const weight = jaccard(tagSets[i].tags, tagSets[j].tags);
      if (weight >= minWeight) {
        pairs.push({
          from: tagSets[i].slug,
          to: tagSets[j].slug,
          weight,
        });
      }
    }
  }

  const edgesByNode = new Map<string, CategoryEdge[]>();
  pairs.forEach((edge) => {
    if (!edgesByNode.has(edge.from)) edgesByNode.set(edge.from, []);
    if (!edgesByNode.has(edge.to)) edgesByNode.set(edge.to, []);
    edgesByNode.get(edge.from)?.push(edge);
    edgesByNode.get(edge.to)?.push(edge);
  });

  const allowed = new Set<string>();
  edgesByNode.forEach((edges, slug) => {
    edges
      .sort((a, b) => b.weight - a.weight)
      .slice(0, maxEdgesPerNode)
      .forEach((edge) => {
        const key = [edge.from, edge.to].sort().join("--");
        allowed.add(key);
      });
  });

  return pairs.filter((edge) => allowed.has([edge.from, edge.to].sort().join("--")));
}
