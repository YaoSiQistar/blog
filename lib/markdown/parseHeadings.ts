import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { Heading } from "mdast";

import type { HeadingNode } from "@/lib/posts/types";
import { createSlugger, slugifyText } from "./slugify";

export function parseHeadings(markdown: string): HeadingNode[] {
  const slugger = createSlugger();
  const tree = unified().use(remarkParse).parse(markdown);
  const headings: HeadingNode[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (typeof node.depth !== "number" || node.depth < 1 || node.depth > 4) return;
    const text = toString(node).trim();
    if (!text) return;
    const id = slugifyText(text, slugger);
    headings.push({ id, depth: node.depth as 1 | 2 | 3 | 4, text });
  });

  return headings;
}
