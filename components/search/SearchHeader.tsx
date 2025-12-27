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
  if (scope === "title") return "标题";
  if (scope === "content") return "正文";
  if (scope === "tags") return "标签";
  return "全部";
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
    ? `“${query}” · ${total} 条结果 · 排序 ${sort === "latest" ? "最新" : "热门"} · 范围 ${formatScope(scope)}`
    : "输入关键词以搜索归档，并可选择范围。";

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
            索引台
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
            搜索归档
          </h1>
        </div>
        <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
          编辑索引
        </span>
      </div>
      <p className="max-w-[80ch] text-sm text-muted-foreground">{summary}</p>
    </motion.header>
  );
}
