import type { HeadingNode } from "@/lib/posts/types";
import type { KintsugNode } from "@/lib/Kintsug-rail/types";

export function buildHeadingNodes(headings: HeadingNode[]): KintsugNode[] {
  return headings.map((heading) => ({
    id: heading.id,
    label: heading.text,
    kind: "heading",
    level: heading.depth === 3 ? 2 : 1,
    target: {
      type: "scroll",
      selector: `#${heading.id}`,
    },
    meta: {
      subtitle: heading.depth === 3 ? "Subsection" : "Chapter",
    },
  }));
}
