"use client";

import * as React from "react";
import { Copy, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import TagFiltersSheet from "./TagFiltersSheet";
import RelatedTagsChips, { RelatedTagItem } from "./RelatedTagsChips";
import {
  buildTagHref,
  normalizeTagState,
  parseTagParams,
  resetPageOnChange,
  MAX_WITH_TAGS,
} from "@/lib/tags/searchParams";
import type { TagQueryState, TagSort } from "@/lib/tags/searchParams";

type TagWorkbenchProps = {
  slug: string;
  relatedTags: RelatedTagItem[];
};

export default function TagWorkbench({ slug, relatedTags }: TagWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  const current = React.useMemo(() => {
    const parsed = parseTagParams(searchParams);
    const safeWith = parsed.with.filter((tag) => tag !== slug);
    return { ...parsed, with: safeWith };
  }, [searchParams, slug]);

  const [queryValue, setQueryValue] = React.useState(current.q ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setQueryValue(current.q ?? "");
  }, [current.q]);

  const commitState = React.useCallback(
    (next: TagQueryState, replace = false) => {
      const normalized = normalizeTagState(next);
      const href = buildTagHref(slug, normalized);
      if (replace) router.replace(href);
      else router.push(href);
    },
    [router, slug]
  );

  const updateState = React.useCallback(
    (partial: Partial<TagQueryState>) => {
      const next = resetPageOnChange(current, { ...current, ...partial });
      commitState(next);
    },
    [commitState, current]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateState({ q: queryValue.trim() || undefined });
  };

  const handleClear = () => {
    setQueryValue("");
    updateState({ q: undefined });
    inputRef.current?.focus();
  };

  const handleSortChange = (value: string) => {
    if (!value) return;
    updateState({ sort: value as TagSort });
  };

  const handleTagToggle = (tag: string) => {
    const exists = current.with.includes(tag);
    if (!exists && current.with.length >= MAX_WITH_TAGS) {
      toast.info("最多可组合 3 个标签。");
      return;
    }
    const nextTags = exists
      ? current.with.filter((t) => t !== tag)
      : [...current.with, tag];
    updateState({ with: nextTags });
  };

  const handleReset = () => {
    setQueryValue("");
    commitState({
      page: 1,
      sort: "latest",
      with: [],
      q: undefined,
    });
  };

  const handleCopy = async () => {
    try {
      const href = buildTagHref(slug, current);
      const url = `${window.location.origin}${href}`;
      await navigator.clipboard.writeText(url);
      toast.success("专题链接已复制。");
    } catch (error) {
      console.error(error);
      toast.error("无法复制链接。");
    }
  };

  return (
    <div className="space-y-4">
      <motion.form
        variants={fadeUp(reduced)}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card/70 p-4"
        )}
      >
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-border-subtle bg-background/70 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={queryValue}
            onChange={(event) => setQueryValue(event.target.value)}
            placeholder="在当前专题中搜索"
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            aria-label="Search within tag dossier"
          />
          {queryValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3" />
            </button>
          ) : null}
        </div>

        <ToggleGroup
          type="single"
          value={current.sort}
          onValueChange={handleSortChange}
          className="hidden rounded-full border border-border-subtle bg-background/70 p-1 lg:flex"
        >
          <ToggleGroupItem value="latest" className="px-3 text-xs uppercase tracking-[0.3em]">
            最新
          </ToggleGroupItem>
          <ToggleGroupItem value="hot" className="px-3 text-xs uppercase tracking-[0.3em]">
            热门
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button type="button" variant="ghost" onClick={handleReset}>
            重置
          </Button>
          <Button type="button" variant="ghost" onClick={handleCopy} aria-label="Copy dossier link">
            <Copy className="mr-2 size-4" />
            复制链接
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <TagFiltersSheet
            state={current}
            relatedTags={relatedTags}
            onApply={(next) => commitState(resetPageOnChange(current, next))}
          />
        </div>
      </motion.form>

      <RelatedTagsChips tags={relatedTags} selected={current.with} onToggle={handleTagToggle} />
    </div>
  );
}
