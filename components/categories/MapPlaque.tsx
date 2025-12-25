"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/lib/categories/mapModel";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { fadeUp } from "@/lib/motion/variants";

type MapPlaqueProps = {
  node: CategoryNode;
  className?: string;
  variant?: "panel" | "compact" | "sheet";
};

export default function MapPlaque({ node, className, variant = "panel" }: MapPlaqueProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const compact = variant === "compact";

  return (
    <motion.div
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-[var(--radius)] border border-border/70 bg-background/70 p-4 shadow-soft backdrop-blur",
        compact && "p-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">
            Selected Gallery
          </p>
          <h3 className={cn("mt-1 text-lg font-semibold text-foreground", compact && "text-base")}>
            {node.name}
          </h3>
          {node.latestDate ? (
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/60">
              Latest {node.latestDate}
            </p>
          ) : null}
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          {node.count}
        </span>
      </div>

      {node.topTags && node.topTags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/70">
          {node.topTags.map((tag) => (
            <span key={`${node.slug}-${tag}`} className="rounded-full border border-border/60 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button asChild size="sm" className="rounded-full">
          <Link href={`/categories/${node.slug}`}>Enter gallery</Link>
        </Button>
        {variant === "sheet" ? (
          <span className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
            Tap again to explore
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}
