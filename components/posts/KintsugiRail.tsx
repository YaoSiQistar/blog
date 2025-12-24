"use client";

import { motion, useScroll, useTransform } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";
import FilterSummary from "./FilterSummary";

const pathD =
  "M60 0 C54 80, 68 140, 58 220 S64 360, 52 440 S66 600, 58 720 S70 880, 60 1000";

type KintsugiRailProps = {
  summary: string;
  page: number;
  totalPages: number;
  className?: string;
};

export default function KintsugiRail({ summary, page, totalPages, className }: KintsugiRailProps) {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9]);

  return (
    <div className={cn("flex flex-col items-start gap-6", className)}>
      <FilterSummary summary={summary} page={page} totalPages={totalPages} />
      <div className="relative h-[70vh] min-h-[420px] w-[120px]">
        <svg viewBox="0 0 120 1000" className="h-full w-full text-primary/60" aria-hidden>
          {!reduced && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 0.35, opacity: 1 }}
              transition={{
                delay: motionTokens.ultra.lineDrawDelay,
                duration: motionTokens.ultra.lineDrawDuration,
                ease: motionTokens.easing.easeOut,
              }}
            />
          )}
          <motion.path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinecap="round"
            style={{
              pathLength: reduced ? 1 : pathLength,
              opacity: reduced ? 0.65 : lineOpacity,
            }}
          />
        </svg>
      </div>
    </div>
  );
}
