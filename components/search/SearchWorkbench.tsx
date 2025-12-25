"use client";

import * as React from "react";
import { Check, Copy, Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import {
  buildSearchHref,
  normalizeSearchState,
  parseSearchParams,
  resetPageOnChange,
  MAX_SEARCH_TAGS,
} from "@/lib/search/query";
import type { SearchQueryState, SearchScope, SearchSort } from "@/lib/search/types";
import { addRecentSearch } from "@/lib/search/recent";

type SearchWorkbenchProps = {
  categories: { slug: string; count: number }[];
  tags: { slug: string; count: number }[];
};

export default function SearchWorkbench({ categories, tags }: SearchWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const current = React.useMemo(() => parseSearchParams(searchParams), [searchParams]);
  const [queryValue, setQueryValue] = React.useState(current.q ?? "");
  const [tagOpen, setTagOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setQueryValue(current.q ?? "");
  }, [current.q]);

  React.useEffect(() => {
    if (!current.q && inputRef.current) {
      inputRef.current.focus();
    }
  }, [current.q]);

  const commitState = React.useCallback((next: SearchQueryState, replace = false) => {
    const normalized = normalizeSearchState(next);
    const href = buildSearchHref(normalized);
    if (replace) router.replace(href);
    else router.push(href);
  }, [router]);

  const updateState = React.useCallback((partial: Partial<SearchQueryState>, replace = false) => {
    const next = resetPageOnChange(current, { ...current, ...partial });
    commitState(next, replace);
  }, [commitState, current]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = queryValue.trim();
    updateState({ q: trimmed || undefined }, false);
    if (trimmed) addRecentSearch(trimmed);
  };

  const handleClear = React.useCallback(() => {
    setQueryValue("");
    updateState({ q: undefined }, false);
  }, [updateState]);

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && inputRef.current === document.activeElement) {
        if (queryValue) {
          handleClear();
        } else {
          inputRef.current?.blur();
        }
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [handleClear, queryValue]);

  const handleScopeChange = (value: string) => {
    if (!value) return;
    updateState({ scope: value as SearchScope });
  };

  const handleSortChange = (value: string) => {
    if (!value) return;
    updateState({ sort: value as SearchSort });
  };

  const handleCategoryChange = (value: string) => {
    updateState({ category: value === "all" ? undefined : value });
  };

  const toggleTag = (slug: string) => {
    const exists = current.tags.includes(slug);
    if (!exists && current.tags.length >= MAX_SEARCH_TAGS) {
      toast.info(`Select up to ${MAX_SEARCH_TAGS} tags.`);
      return;
    }
    const nextTags = exists ? current.tags.filter((tag) => tag !== slug) : [...current.tags, slug];
    updateState({ tags: nextTags });
  };

  const handleReset = () => {
    setQueryValue("");
    commitState({
      q: undefined,
      page: 1,
      sort: "relevance",
      scope: "all",
      category: undefined,
      tags: [],
    });
  };

  const handleCopy = async () => {
    try {
      const href = buildSearchHref(current);
      const url = `${window.location.origin}${href}`;
      await navigator.clipboard.writeText(url);
      toast.success("Search link copied.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy link.");
    }
  };

  const showChips = current.q || current.category || current.tags.length > 0 || current.scope !== "all" || current.sort !== "relevance";

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
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-border-subtle bg-background/70 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={queryValue}
            onChange={(event) => setQueryValue(event.target.value)}
            placeholder="Search the archive"
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            aria-label="Search the archive"
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
          <KbdGroup className="hidden items-center gap-1 text-muted-foreground lg:flex">
            <Kbd>Cmd</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>

        <Button type="submit" className="rounded-full">
          Search
        </Button>

        <div className="hidden items-center gap-3 lg:flex">
          <ToggleGroup
            type="single"
            value={current.scope}
            onValueChange={handleScopeChange}
            className="rounded-full border border-border-subtle bg-background/70 p-1"
          >
            <ToggleGroupItem value="all" className="px-3 text-xs uppercase tracking-[0.3em]">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="title" className="px-3 text-xs uppercase tracking-[0.3em]">
              Title
            </ToggleGroupItem>
            <ToggleGroupItem value="content" className="px-3 text-xs uppercase tracking-[0.3em]">
              Content
            </ToggleGroupItem>
            <ToggleGroupItem value="tags" className="px-3 text-xs uppercase tracking-[0.3em]">
              Tags
            </ToggleGroupItem>
          </ToggleGroup>

          <Select value={current.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px] rounded-full text-xs uppercase tracking-[0.3em]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
            </SelectContent>
          </Select>

          <Select value={current.category ?? "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px] rounded-full text-xs uppercase tracking-[0.3em]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.slug} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={tagOpen} onOpenChange={setTagOpen}>
            <PopoverTrigger asChild>
              <Button variant="secondary" className="rounded-full">
                Tags ({current.tags.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-0">
              <Command>
                <CommandInput placeholder="Filter tags" />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup heading="Tags">
                    {tags.map((tag) => {
                      const active = current.tags.includes(tag.slug);
                      return (
                        <CommandItem
                          key={tag.slug}
                          value={tag.slug}
                          onSelect={() => toggleTag(tag.slug)}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{tag.slug}</span>
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            {tag.count}
                            {active ? <Check className="size-3" /> : null}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" variant="ghost" onClick={handleCopy} aria-label="Copy search link">
            <Copy className="mr-2 size-4" />
            Copy link
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="secondary">
                <SlidersHorizontal className="mr-2 size-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Scope</p>
                  <ToggleGroup
                    type="single"
                    value={current.scope}
                    onValueChange={handleScopeChange}
                    className="rounded-full border border-border-subtle bg-background/70 p-1"
                  >
                    <ToggleGroupItem value="all" className="px-3 text-xs uppercase tracking-[0.3em]">
                      All
                    </ToggleGroupItem>
                    <ToggleGroupItem value="title" className="px-3 text-xs uppercase tracking-[0.3em]">
                      Title
                    </ToggleGroupItem>
                    <ToggleGroupItem value="content" className="px-3 text-xs uppercase tracking-[0.3em]">
                      Content
                    </ToggleGroupItem>
                    <ToggleGroupItem value="tags" className="px-3 text-xs uppercase tracking-[0.3em]">
                      Tags
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sort</p>
                  <Select value={current.sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full rounded-full text-xs uppercase tracking-[0.3em]">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="latest">Latest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Category</p>
                  <Select value={current.category ?? "all"} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full rounded-full text-xs uppercase tracking-[0.3em]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.slug} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Tags</p>
                  <div className="grid gap-2">
                    {tags.map((tag) => {
                      const active = current.tags.includes(tag.slug);
                      return (
                        <button
                          key={tag.slug}
                          type="button"
                          onClick={() => toggleTag(tag.slug)}
                          className={cn(
                            "rounded-full border px-3 py-2 text-left text-xs uppercase tracking-[0.3em] transition",
                            active
                              ? "border-primary/50 bg-primary/10 text-foreground"
                              : "border-border/70 text-muted-foreground hover:bg-card/70"
                          )}
                        >
                          {tag.slug} ({tag.count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleCopy}>
                    <Copy className="mr-2 size-4" />
                    Copy link
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.form>

      {showChips ? (
        <div className="flex flex-wrap items-center gap-2">
          {current.q ? (
            <Badge variant="outline" className="rounded-full border-border-subtle text-xs uppercase tracking-[0.3em]">
              Query: {current.q}
              <button
                type="button"
                className="ml-2"
                onClick={handleClear}
                aria-label="Remove query"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ) : null}
          {current.category ? (
            <Badge className="rounded-full border-border-subtle bg-primary/10 text-xs uppercase tracking-[0.3em] text-foreground">
              Category: {current.category}
              <button
                type="button"
                className="ml-2"
                onClick={() => updateState({ category: undefined })}
                aria-label="Remove category"
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
                onClick={() => toggleTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {current.scope !== "all" ? (
            <Badge variant="outline" className="rounded-full border-border-subtle text-xs uppercase tracking-[0.3em]">
              Scope: {current.scope}
              <button
                type="button"
                className="ml-2"
                onClick={() => updateState({ scope: "all" })}
                aria-label="Reset scope"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ) : null}
          {current.sort !== "relevance" ? (
            <Badge variant="outline" className="rounded-full border-border-subtle text-xs uppercase tracking-[0.3em]">
              Sort: {current.sort}
              <button
                type="button"
                className="ml-2"
                onClick={() => updateState({ sort: "relevance" })}
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
