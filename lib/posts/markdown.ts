import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import {toString}  from "mdast-util-to-string";
import Slugger from "github-slugger";

import type { HeadingNode } from "./types";

export function extractHeadings(markdown: string): HeadingNode[] {
  const slugger = new Slugger();
  const tree = unified().use(remarkParse).parse(markdown);
  const headings: HeadingNode[] = [];

  visit(tree, "heading", (node) => {
    if (typeof node.depth !== "number") return;
    if (node.depth !== 2 && node.depth !== 3) return;

    const text = toString(node).trim();
    if (!text) return;

    const id = slugger.slug(text);
    headings.push({
      depth: node.depth as 2 | 3,
      id,
      text,
    });
  });

  return headings;
}
