"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, Copy, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { toast } from "sonner";
import FiltersSheet from "./FiltersSheet";
import { parsePostsQuery, updatePostsQuery } from "./query";

type GuideItem = { slug: string; count: number };

type EditorialWorkbenchProps = {
  tags: GuideItem[];
};

export default function EditorialWorkbench({ tags }: EditorialWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const current = React.useMemo(() => parsePostsQuery(searchParams), [searchParams]);
  const [searchValue, setSearchValue] = React.useState(current.q ?? "");
  const [tagsOpen, setTagsOpen] = React.useState(false);

  React.useEffect(() => {
    setSearchValue(current.q ?? "");
  }, [current.q]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextValue = searchValue.trim() || undefined;
    const { href } = updatePostsQuery(searchParams, { next: { q: nextValue } });
    if (href) router.push(href);
  };

  const handleSortChange = (value: string) => {
    if (!value) return;
    const { href } = updatePostsQuery(searchParams, { next: { sort: value as "latest" | "hot" } });
    if (href) router.push(href);
  };

  const handleTagToggle = (slug: string) => {
    const nextTags = current.tags.includes(slug)
      ? current.tags.filter((tag) => tag !== slug)
      : [...current.tags, slug];
    const { href } = updatePostsQuery(searchParams, { next: { tags: nextTags } });
    if (href) router.push(href);
  };

  const handleReset = () => {
    const { href } = updatePostsQuery(searchParams, {
      next: { category: undefined, tags: [], q: undefined, sort: "latest", page: 1 },
      resetPage: true,
    });
    if (href) router.push(href);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Guide link copied.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy link.");
    }
  };

  return (
    <div className="space-y-4">
      <motion.form
        variants={fadeUp(reduced)}
        initial="hidden"
        animate="visible"
        onSubmit={handleSearchSubmit}
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card/70 p-4"
        )}
      >
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-border-subtle bg-background/70 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search the archive"
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            aria-label="Search posts"
          />
        </div>

        <ToggleGroup
          type="single"
          value={current.sort}
          onValueChange={handleSortChange}
          className="rounded-full border border-border-subtle bg-background/70 p-1"
        >
          <ToggleGroupItem value="latest" className="px-3 text-xs uppercase tracking-[0.3em]">
            Latest
          </ToggleGroupItem>
          <ToggleGroupItem value="hot" className="px-3 text-xs uppercase tracking-[0.3em]">
            Hot
          </ToggleGroupItem>
        </ToggleGroup>

        <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
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
                        onSelect={() => handleTagToggle(tag.slug)}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{tag.slug}</span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          {tag.count}
                          {active && <Check className="size-3" />}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button type="button" variant="ghost" onClick={handleReset}>
          Reset
        </Button>

        <Button type="button" variant="ghost" onClick={handleCopy} aria-label="Copy guide link">
          <Copy className="mr-2 size-4" /> Copy link
        </Button>

        <div className="ml-auto lg:hidden">
          <FiltersSheet tags={tags} />
        </div>
      </motion.form>

      <div className="flex flex-wrap items-center gap-2">
        {current.category && (
          <Badge className="rounded-full border border-border-subtle bg-primary/10 text-xs uppercase tracking-[0.3em] text-foreground">
            Gallery: {current.category}
            <button
              type="button"
              onClick={() => {
                const { href } = updatePostsQuery(searchParams, { next: { category: undefined } });
                if (href) router.push(href);
              }}
              className="ml-2"
              aria-label="Remove category filter"
            >
              <X className="size-3" />
            </button>
          </Badge>
        )}
        {current.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-full border border-border-subtle bg-card/70 text-xs uppercase tracking-[0.3em]"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleTagToggle(tag)}
              className="ml-2"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        {current.q && (
          <Badge
            variant="outline"
            className="rounded-full border border-border-subtle text-xs uppercase tracking-[0.3em]"
          >
            Search: {current.q}
            <button
              type="button"
              onClick={() => {
                const { href } = updatePostsQuery(searchParams, { next: { q: undefined } });
                if (href) router.push(href);
              }}
              className="ml-2"
              aria-label="Remove search"
            >
              <X className="size-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}
