"use client";

import { TableOfContents } from "@/components/markdown/TableOfContents";
import type { HeadingNode } from "@/lib/posts/types";

type AboutTOCProps = {
  headings: HeadingNode[];
};

export default function AboutTOC({ headings }: AboutTOCProps) {
  if (!headings.length) return null;
  return <TableOfContents headings={headings} />;
}
