import type { Root, Element } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

const isMermaidBlock = (node: Element) => {
  if (node.tagName !== "code") return false;
  const className = node.properties?.className;
  if (!Array.isArray(className)) return false;
  return className.some((value) => typeof value === "string" && value.includes("language-mermaid"));
};

export const rehypeMermaid: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || typeof index !== "number") return;
      if (node.tagName !== "pre") return;
      const code = node.children?.[0];
      if (!code || code.type !== "element" || !isMermaidBlock(code)) return;

      const raw = toString(code).trim();
      parent.children[index] = {
        type: "element",
        tagName: "MermaidBlock",
        properties: {
          code: raw,
          className: "",
        },
        children: [],
      };
    });
  };
};
