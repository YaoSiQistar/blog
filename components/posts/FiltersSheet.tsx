"use client";

import * as React from "react";
import { Check, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { parsePostsQuery, updatePostsQuery } from "./query";

type KintsugItem = { slug: string; count: number };

type FiltersSheetProps = {
  tags: KintsugItem[];
};

export default function FiltersSheet({ tags }: FiltersSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = React.useMemo(() => parsePostsQuery(searchParams), [searchParams]);

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="rounded-full">
          <Filter className="mr-2 size-4" /> 筛选
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="space-y-6">
        <SheetHeader>
          <SheetTitle>博客筛选</SheetTitle>
        </SheetHeader>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">排序</p>
          <ToggleGroup
            type="single"
            value={current.sort}
            onValueChange={handleSortChange}
            className="rounded-full border border-border-subtle bg-background/70 p-1"
          >
            <ToggleGroupItem value="latest" className="px-3 text-xs uppercase tracking-[0.3em]">
              最新
            </ToggleGroupItem>
            <ToggleGroupItem value="hot" className="px-3 text-xs uppercase tracking-[0.3em]">
              热门
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">标签</p>
          <ScrollArea className="h-48">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = current.tags.includes(tag.slug);
                return (
                  <button
                    key={tag.slug}
                    type="button"
                    onClick={() => handleTagToggle(tag.slug)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em]",
                      active
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border-subtle text-muted-foreground"
                    )}
                  >
                    {active && <Check className="size-3" />}
                    {tag.slug}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
