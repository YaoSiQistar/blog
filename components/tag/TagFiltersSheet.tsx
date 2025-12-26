"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { TagQueryState, TagSort } from "@/lib/tags/searchParams";
import { MAX_WITH_TAGS } from "@/lib/tags/searchParams";
import type { RelatedTagItem } from "./RelatedTagsChips";

type TagFiltersSheetProps = {
  state: TagQueryState;
  relatedTags: RelatedTagItem[];
  onApply: (state: TagQueryState) => void;
};

export default function TagFiltersSheet({
  state,
  relatedTags,
  onApply,
}: TagFiltersSheetProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<TagQueryState>(state);
  const [tagQuery, setTagQuery] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setDraft(state);
      setTagQuery("");
    }
  }, [open, state]);

  const filteredTags = relatedTags.filter((tag) =>
    tag.slug.toLowerCase().includes(tagQuery.trim().toLowerCase())
  );

  const toggleTag = (slug: string) => {
    const exists = draft.with.includes(slug);
    if (!exists && draft.with.length >= MAX_WITH_TAGS) return;
    const nextTags = exists
      ? draft.with.filter((tag) => tag !== slug)
      : [...draft.with, slug];
    setDraft((prev) => ({ ...prev, with: nextTags }));
  };

  const handleSortChange = (value: string) => {
    if (!value) return;
    setDraft((prev) => ({ ...prev, sort: value as TagSort }));
  };

  const handleReset = () => {
    setDraft({
      page: 1,
      sort: "latest",
      with: [],
      q: undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="secondary">
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Tag Filters
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Search</p>
            <Input
              value={draft.q ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, q: event.target.value }))}
              placeholder="Search within this dossier"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sort</p>
            <ToggleGroup
              type="single"
              value={draft.sort}
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
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">With tags</p>
            <Input
              value={tagQuery}
              onChange={(event) => setTagQuery(event.target.value)}
              placeholder="Filter related tags"
              className="h-9 text-sm"
            />
            <div className="grid gap-2">
              {filteredTags.map((tag) => {
                const active = draft.with.includes(tag.slug);
                const disabled = !active && draft.with.length >= MAX_WITH_TAGS;
                return (
                  <button
                    key={tag.slug}
                    type="button"
                    onClick={() => toggleTag(tag.slug)}
                    disabled={disabled}
                    className={cn(
                      "flex items-center justify-between rounded-full border px-3 py-2 text-left text-[0.6rem] uppercase tracking-[0.3em] transition",
                      active
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border-subtle text-muted-foreground hover:border-primary/50",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <span>{tag.name}</span>
                    <span className="flex items-center gap-2 text-[0.55rem]">
                      {tag.count}
                      {active ? <Check className="size-3" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/60">
              Combine up to {MAX_WITH_TAGS} tags.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button
              type="button"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
