"use client";

import * as React from "react";
import { Copy, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import CategoryTagsPanel from "./CategoryTagsPanel";
import CategoryFiltersSheet from "./CategoryFiltersSheet";
import {
  buildCategoryHref,
  normalizeCategoryState,
  parseCategoryParams,
  resetPageOnChange,
  MAX_CATEGORY_TAGS,
} from "@/lib/categories/searchParams";
import type { CategoryQueryState, CategorySort } from "@/lib/categories/searchParams";

type TagItem = {
  slug: string;
  count: number;
};

type CategoryWorkbenchProps = {
  slug: string;
  tags: TagItem[];
};

export default function CategoryWorkbench({ slug, tags }: CategoryWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const allowedTags = React.useMemo(() => new Set(tags.map((tag) => tag.slug)), [tags]);
  const current = React.useMemo(() => {
    const parsed = parseCategoryParams(searchParams);
    const safeTags = parsed.tags.filter((tag) => allowedTags.has(tag));
    return { ...parsed, tags: safeTags };
  }, [allowedTags, searchParams]);
  const [queryValue, setQueryValue] = React.useState(current.q ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setQueryValue(current.q ?? "");
  }, [current.q]);

  const commitState = React.useCallback(
    (next: CategoryQueryState, replace = false) => {
      const normalized = normalizeCategoryState(next);
      const href = buildCategoryHref(slug, normalized);
      if (replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [router, slug]
  );

  const updateState = React.useCallback(
    (partial: Partial<CategoryQueryState>) => {
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
    updateState({ sort: value as CategorySort });
  };

  const handleTagToggle = (tag: string) => {
    const exists = current.tags.includes(tag);
    if (!exists && current.tags.length >= MAX_CATEGORY_TAGS) {
      toast.info(`最多选择 ${MAX_CATEGORY_TAGS} 个标签。`);
      return;
    }
    const nextTags = exists ? current.tags.filter((t) => t !== tag) : [...current.tags, tag];
    updateState({ tags: nextTags });
  };

  const handleReset = () => {
    setQueryValue("");
    commitState({
      page: 1,
      sort: "latest",
      tags: [],
      q: undefined,
    });
  };

  const handleCopy = async () => {
    try {
      const href = buildCategoryHref(slug, current);
      const url = `${window.location.origin}${href}`;
      await navigator.clipboard.writeText(url);
      toast.success("展厅链接已复制。");
    } catch (error) {
      console.error(error);
      toast.error("无法复制链接。");
    }
  };

  const showChips =
    current.q || current.tags.length > 0 || current.sort !== "latest";
  const sortLabel = current.sort === "latest" ? "Latest" : "Hot";

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
            placeholder="在当前展厅中搜索"
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            aria-label="Search within gallery"
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
          <Button type="button" variant="ghost" onClick={handleCopy} aria-label="Copy gallery link">
            <Copy className="mr-2 size-4" />
            复制链接
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <CategoryFiltersSheet
            state={current}
            tags={tags}
            onApply={(next) => commitState(resetPageOnChange(current, next))}
          />
        </div>
      </motion.form>

      <CategoryTagsPanel
        tags={tags}
        selected={current.tags}
        onToggle={handleTagToggle}
      />

      {showChips ? (
        <div className="flex flex-wrap items-center gap-2">
          {current.q ? (
            <Badge variant="outline" className="rounded-full border-border-subtle text-xs uppercase tracking-[0.3em]">
              搜索：{current.q}
              <button
                type="button"
                className="ml-2"
                onClick={handleClear}
                aria-label="Remove search"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ) : null}
          {current.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full border-border-subtle bg-card/70 text-xs uppercase tracking-[0.3em]"
            >
              {tag}
              <button
                type="button"
                className="ml-2"
                onClick={() => handleTagToggle(tag)}
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {current.sort !== "latest" ? (
            <Badge variant="outline" className="rounded-full border-border-subtle text-xs uppercase tracking-[0.3em]">
              Sort: {sortLabel}
              <button
                type="button"
                className="ml-2"
                onClick={() => updateState({ sort: "latest" })}
                aria-label="Reset sort"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
