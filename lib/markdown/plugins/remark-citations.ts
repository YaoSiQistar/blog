import type { Root, Text, Parent, Link } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const CITE_REGEX = /\[@\/?([^\]]+?)\]/g;

export const remarkCitations: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== "number") return;
      if (parent.type === "link" || parent.type === "inlineCode" || parent.type === "code") return;

      const value = node.value;
      if (!value || !CITE_REGEX.test(value)) return;
      CITE_REGEX.lastIndex = 0;

      const newNodes: Array<Text | Link> = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;

      while ((match = CITE_REGEX.exec(value))) {
        if (match.index > lastIndex) {
          newNodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
        }

        const id = match[1]?.trim();
        if (id) {
          newNodes.push({
            type: "link",
            url: `#ref-${id}`,
            data: {
              hProperties: {
                "data-citation": "true",
                "data-cite-id": id,
              },
            },
            children: [{ type: "text", value: id }],
          });
        }

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
