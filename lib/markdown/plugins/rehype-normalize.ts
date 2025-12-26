import type { Root, Element } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const normalizeClassName = (value: unknown) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const parts = value.split(/\s+/).filter(Boolean);
    return parts.length ? parts : undefined;
  }
  return [String(value)];
};

export const rehypeNormalizeProperties: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      node.properties = node.properties ?? {};
      const normalized = normalizeClassName(node.properties.className);
      if (normalized) {
        node.properties.className = normalized;
      } else {
        delete node.properties.className;
      }
    });
  };
};
