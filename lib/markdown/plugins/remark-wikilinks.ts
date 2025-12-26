import type { Root, Text, Parent, Link } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

interface WikiOptions {
  existingSlugs?: Set<string>;
  resolveHref?: (slug: string) => string;
}

const WIKI_REGEX = /\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;

export const remarkWikilinks: Plugin<[WikiOptions?], Root> = (options = {}) => {
  const resolveHref = options.resolveHref ?? ((slug: string) => `/posts/${slug}`);

  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== "number") return;
      if (parent.type === "link" || parent.type === "inlineCode" || parent.type === "code") return;

      const value = node.value;
      if (!value || !WIKI_REGEX.test(value)) return;
      WIKI_REGEX.lastIndex = 0;

      const newNodes: Array<Text | Link> = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;

      while ((match = WIKI_REGEX.exec(value))) {
        if (match.index > lastIndex) {
          newNodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
        }

        const left = match[1]?.trim() ?? "";
        const right = match[2]?.trim();
        const title = right ? left : left;
        const slug = right ? right : left;
        const isMissing = options.existingSlugs ? !options.existingSlugs.has(slug) : false;

        newNodes.push({
          type: "link",
          url: resolveHref(slug),
          data: {
            hProperties: {
              "data-wikilink": "true",
              "data-missing": isMissing ? "true" : undefined,
            },
          },
          children: [{ type: "text", value: title }],
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < value.length) {
        newNodes.push({ type: "text", value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
};
