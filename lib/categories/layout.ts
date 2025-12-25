type LayoutNodeInput = {
  slug: string;
  size: number;
  cluster?: string;
};

type LayoutPoint = {
  x: number;
  y: number;
};

const bounds = {
  min: 0.08,
  max: 0.92,
};

const clamp = (value: number, min = bounds.min, max = bounds.max) =>
  Math.min(max, Math.max(min, value));

const hashString = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const createClusterCenters = (clusters: string[]) => {
  const centers = new Map<string, LayoutPoint>();
  const unique = clusters.filter((value, index) => clusters.indexOf(value) === index);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  unique.forEach((cluster, index) => {
    const angle = index * goldenAngle;
    const radius = 0.28 + (index % 3) * 0.04;
    const x = clamp(0.5 + Math.cos(angle) * radius);
    const y = clamp(0.5 + Math.sin(angle) * radius);
    centers.set(cluster, { x, y });
  });

  return centers;
};

export function layoutCategoryNodes(nodes: LayoutNodeInput[]) {
  if (nodes.length === 0) return new Map<string, LayoutPoint>();

  const clusters = nodes.map((node) => node.cluster ?? "default");
  const centers = createClusterCenters(clusters);

  const positions = nodes.map((node) => {
    const rng = mulberry32(hashString(node.slug));
    const center = centers.get(node.cluster ?? "default") ?? { x: 0.5, y: 0.5 };
    const jitterX = (rng() - 0.5) * 0.36;
    const jitterY = (rng() - 0.5) * 0.36;
    return {
      slug: node.slug,
      x: clamp(center.x + jitterX),
      y: clamp(center.y + jitterY),
      size: node.size,
      cluster: node.cluster ?? "default",
    };
  });

  const iterations = Math.max(30, Math.min(120, nodes.length * 6));
  for (let iter = 0; iter < iterations; iter += 1) {
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const a = positions[i];
        const b = positions[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        const minDistance = 0.04 + (a.size + b.size) * 0.06;

        if (distance < minDistance) {
          const push = (minDistance - distance) / distance;
          const offsetX = (dx * push) / 2;
          const offsetY = (dy * push) / 2;
          a.x = clamp(a.x - offsetX);
          a.y = clamp(a.y - offsetY);
          b.x = clamp(b.x + offsetX);
          b.y = clamp(b.y + offsetY);
        }
      }
    }

    positions.forEach((node) => {
      const center = centers.get(node.cluster) ?? { x: 0.5, y: 0.5 };
      node.x = clamp(node.x + (center.x - node.x) * 0.02);
      node.y = clamp(node.y + (center.y - node.y) * 0.02);
    });
  }

  return new Map<string, LayoutPoint>(
    positions.map((node) => [node.slug, { x: node.x, y: node.y }])
  );
}
