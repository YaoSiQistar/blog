"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import CatalogList, { CatalogPost } from "@/components/catalog/CatalogList";
import { fadeIn } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import type { SearchResultItem } from "@/lib/search/types";
import { highlightText } from "@/lib/search/highlight";
import MatchSnippet from "@/components/search/MatchSnippet";

type SearchResultsProps = {
  items: SearchResultItem[];
  query: string;
  page: number;
  pageSize: number;
  transitionKey?: string;
};

export default function SearchResults({
  items,
  query,
  page,
  pageSize,
  transitionKey,
}: SearchResultsProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const [animatedOnce, setAnimatedOnce] = useState(false);

  useEffect(() => {
    if (!animatedOnce) setAnimatedOnce(true);
  }, [animatedOnce]);

  const results: CatalogPost[] = items.map((item) => ({
    title: highlightText(item.title, query),
    slug: item.slug,
    excerpt: highlightText(item.excerpt, query),
    category: item.category,
    date: item.date,
    readingTime: item.readingTime,
    tags: item.tags,
    supplemental: <MatchSnippet snippet={item.snippet} query={query} />,
  }));

  return (
    <motion.div
      key={transitionKey}
      variants={fadeIn(reduced)}
      initial="hidden"
      animate="visible"
    >
      <CatalogList
        items={results}
        startIndex={(page - 1) * pageSize}
        stagger={!animatedOnce}
      />
    </motion.div>
  );
}
