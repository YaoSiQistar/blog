"use client";

import { motion } from "motion/react";

import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

type TagHeroProps = {
  name: string;
  subtitle: string;
  description: string;
  count: number;
  latestDate?: string;
  className?: string;
};

export default function TagHero({
  name,
  subtitle,
  description,
  count,
  latestDate,
  className,
}: TagHeroProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  return (
    <motion.section
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground/70">
            Tag Dossier
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {name}
          </h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/70">
          <span>{count} works</span>
          {latestDate ? <span>Updated {latestDate}</span> : null}
        </div>
      </div>

      <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>

      <div className="flex items-center gap-3">
        <span className="h-px w-24 bg-border" />
        <span className="h-2 w-2 rounded-full border border-border bg-card" />
        <span className="h-px flex-1 bg-border" />
      </div>
    </motion.section>
  );
}
