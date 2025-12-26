import type { Root, Element } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const rehypeEmbeds: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "embed") {
        node.tagName = "EmbedCard";
        return;
      }
      if (node.tagName === "post") {
        node.tagName = "PostCardEmbed";
      }
    });
  };
};
