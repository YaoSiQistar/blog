"use client";

import * as React from "react";
import { Check, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type TagItem = {
  slug: string;
  count: number;
};

type CategoryTagsPanelProps = {
  tags: TagItem[];
  selected: string[];
  onToggle: (slug: string) => void;
  maxVisible?: number;
  className?: string;
};

export default function CategoryTagsPanel({
  tags,
  selected,
  onToggle,
  maxVisible = 12,
  className,
}: CategoryTagsPanelProps) {
  const [open, setOpen] = React.useState(false);
  const visible = tags.slice(0, maxVisible);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
        <span>热门标签</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-2 text-[0.55rem] uppercase tracking-[0.3em]">
              <Search className="size-3" />
              查找标签
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0">
            <Command>
              <CommandInput placeholder="搜索标签" />
              <CommandList>
                <CommandEmpty>未找到标签。</CommandEmpty>
                <CommandGroup heading="标签">
                  {tags.map((tag) => {
                    const active = selected.includes(tag.slug);
                    return (
                      <CommandItem
                        key={tag.slug}
                        value={tag.slug}
                        onSelect={() => onToggle(tag.slug)}
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

      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {visible.map((tag) => {
          const active = selected.includes(tag.slug);
          return (
            <button
              key={tag.slug}
              type="button"
              onClick={() => onToggle(tag.slug)}
              className={cn(
                "rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] transition",
                active
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border-subtle text-muted-foreground hover:border-primary/50"
              )}
            >
              {tag.slug} ({tag.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
