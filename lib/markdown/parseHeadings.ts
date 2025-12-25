import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { Heading } from "mdast";

import type { HeadingNode } from "@/lib/posts/types";
import { createSlugger, slugifyText } from "./slugify";

export function parseHeadings(markdown: string): HeadingNode[] {
  const slugger = createSlugger();
  const tree = unified().use(remarkParse).parse(markdown);
  const headings: HeadingNode[] = [];

  (tree.children as Heading[]).forEach((node) => {
    if (!node || node.type !== "heading") return;
    if (typeof node.depth !== "number" || node.depth < 1 || node.depth > 3) return;
    const text = toString(node).trim();
    if (!text) return;
    const id = slugifyText(text, slugger);
    headings.push({ id, depth: node.depth as 1 | 2 | 3, text });
  });

  return headings;
}
