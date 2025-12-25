"use client";

import { motion } from "motion/react";

import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";
import type { SearchScope, SearchSort } from "@/lib/search/types";

type SearchHeaderProps = {
  query?: string;
  total: number;
  sort: SearchSort;
  scope: SearchScope;
  className?: string;
};

const formatScope = (scope: SearchScope) => {
  if (scope === "title") return "title";
  if (scope === "content") return "content";
  if (scope === "tags") return "tags";
  return "all";
};

export default function SearchHeader({
  query,
  total,
  sort,
  scope,
  className,
}: SearchHeaderProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  const summary = query
    ? `"${query}" - ${total} results - sorted by ${sort} - scope ${formatScope(scope)}`
    : "Type to search the archive and refine your scope.";

  return (
    <motion.header
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
            Index Desk
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
            Search the Archive
          </h1>
        </div>
        <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
          Editorial Index
        </span>
      </div>
      <p className="max-w-[80ch] text-sm text-muted-foreground">{summary}</p>
    </motion.header>
  );
}
