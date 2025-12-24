"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { updatePostsQuery } from "./query";

type GuideItem = { slug: string; count: number };

type MuseumGuidePanelProps = {
  categories: GuideItem[];
  tags: GuideItem[];
};

export default function MuseumGuidePanel({ categories, tags }: MuseumGuidePanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const [tagQuery, setTagQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);

  const currentCategory = searchParams.get("category") || undefined;
  const selectedTags = React.useMemo(() => {
    const raw = searchParams.get("tags");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const visibleTags = React.useMemo(() => {
    const filtered = tags.filter((tag) =>
      tag.slug.toLowerCase().includes(tagQuery.trim().toLowerCase())
    );
    return expanded ? filtered : filtered.slice(0, 10);
  }, [expanded, tagQuery, tags]);

  const handleCategoryClick = (slug: string) => {
    const nextCategory = currentCategory === slug ? undefined : slug;
    const { href } = updatePostsQuery(searchParams, { next: { category: nextCategory } });
    if (href) router.push(href);
  };

  const handleTagToggle = (slug: string) => {
    const nextTags = selectedTags.includes(slug)
      ? selectedTags.filter((tag) => tag !== slug)
      : [...selectedTags, slug];
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

  return (
    <motion.aside
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className="space-y-6 rounded-[var(--radius)] border border-border bg-card/70 p-5"
    >
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
          Museum Guide
        </p>
        <h3 className="text-base font-semibold text-foreground">Galleries</h3>
      </div>

      <div className="space-y-2">
        {categories.map((item) => {
          const active = currentCategory === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleCategoryClick(item.slug)}
              className={cn(
                "group relative flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm transition",
                "before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-transparent before:transition-colors",
                active
                  ? "border-primary/60 bg-primary/10 text-foreground before:bg-primary/70"
                  : "border-border-subtle bg-card/50 text-muted-foreground hover:border-primary/50 hover:before:bg-primary/60"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    active ? "bg-primary" : "bg-border"
                  )}
                />
                <span className={cn(active && "text-foreground")}>{item.slug}</span>
              </span>
              <span className="text-xs text-muted-foreground/70">{item.count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Popular Tags</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[0.6rem] uppercase tracking-[0.3em]"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label="Toggle tags"
          >
            {expanded ? (
              <>
                Less <ChevronUp className="ml-1 size-3" />
              </>
            ) : (
              <>
                More <ChevronDown className="ml-1 size-3" />
              </>
            )}
          </Button>
        </div>
        <Input
          value={tagQuery}
          onChange={(event) => setTagQuery(event.target.value)}
          placeholder="Search tags"
          className="h-9 text-sm"
          aria-label="Search tags"
        />
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => {
            const active = selectedTags.includes(tag.slug);
            return (
              <button
                key={tag.slug}
                type="button"
                onClick={() => handleTagToggle(tag.slug)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] transition",
                  active
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border-subtle text-muted-foreground hover:border-primary/50"
                )}
              >
                {active && <Check className="size-3" />}
                {tag.slug}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-border-subtle bg-card/80 p-3">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          Shortcuts
        </p>
        <Button asChild variant="ghost" className="w-full justify-between text-sm">
          <Link href="/me">
            <span>My Favorites</span>
            <span className="text-xs text-muted-foreground/60">/me</span>
          </Link>
        </Button>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleReset}
      >
        Clear guide
      </Button>
    </motion.aside>
  );
}
