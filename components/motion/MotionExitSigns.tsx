"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";

export type MotionExitSignsProps = {
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
};

export default function MotionExitSigns({
  primaryLabel = "Return to catalog",
  secondaryLabel = "Explore by theme",
  className,
}: MotionExitSignsProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section className={cn("space-y-6", className)}>
      <motion.div
        className="h-px w-full bg-border/70"
        initial={prefersReduced ? false : { scaleX: 0 }}
        animate={prefersReduced ? false : { scaleX: 1 }}
        transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing.easeOut }}
        style={{ transformOrigin: "left" }}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[primaryLabel, secondaryLabel].map((label) => (
          <motion.div
            key={label}
            className="group rounded-[var(--radius)] border border-border bg-card/70 p-5"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={prefersReduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.durations.normal, ease: motionTokens.easing.easeOut }}
          >
            <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Exit</div>
            <div className="mt-2 text-lg font-semibold text-foreground">{label}</div>
            <div className="mt-4 h-px w-full bg-border/70 opacity-0 transition group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}