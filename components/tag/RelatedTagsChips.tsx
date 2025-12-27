"use client";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

export type RelatedTagItem = {
  slug: string;
  name: string;
  count: number;
};

type RelatedTagsChipsProps = {
  tags: RelatedTagItem[];
  selected: string[];
  onToggle: (slug: string) => void;
  className?: string;
};

export default function RelatedTagsChips({
  tags,
  selected,
  onToggle,
  className,
}: RelatedTagsChipsProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
        <span>相关标签</span>
        <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/50">
          前 {Math.min(tags.length, 12)}
        </span>
      </div>
      <motion.div
        variants={staggerContainer(reduced)}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {tags.map((tag) => {
          const active = selected.includes(tag.slug);
          return (
            <motion.button
              key={tag.slug}
              type="button"
              variants={staggerItem(reduced)}
              onClick={() => onToggle(tag.slug)}
              className={cn(
                "rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] transition",
                active
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border-subtle text-muted-foreground hover:border-primary/50"
              )}
            >
              {tag.name}
              <span className="ml-2 text-[0.55rem] text-muted-foreground/70">
                {tag.count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
