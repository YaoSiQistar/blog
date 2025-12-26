"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

type AboutHighlightsProps = {
  items: string[];
};

export default function AboutHighlights({ items }: AboutHighlightsProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const display = items.slice(0, 6);

  if (!display.length) return null;

  return (
    <section className="space-y-4">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        Principles
      </p>
      <motion.div
        variants={staggerContainer(reduced)}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {display.map((item) => (
          <motion.article
            key={item}
            variants={staggerItem(reduced)}
            className={cn(
              "rounded-[var(--radius-xl)] border border-border/70 bg-card/70 px-5 py-4 text-sm text-foreground",
              "backdrop-blur-md"
            )}
          >
            {item}
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
