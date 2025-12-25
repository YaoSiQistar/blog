"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import type { SearchResultItem } from "@/lib/search/types";

type KintsugiResultRailProps = {
  items: SearchResultItem[];
  total: number;
  page: number;
  totalPages: number;
};

const railPath = "M24 0 C20 140, 28 260, 24 380 S26 660, 22 780 S24 920, 24 1000";

export default function KintsugiResultRail({
  items,
  total,
  page,
  totalPages,
}: KintsugiResultRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [railHeight, setRailHeight] = useState(360);
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const progress = totalPages > 1 ? Math.min(page / totalPages, 1) : 1;

  useEffect(() => {
    const update = () => {
      const height = railRef.current?.clientHeight ?? 360;
      setRailHeight(height);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const positions = useMemo(() => {
    if (items.length <= 1) return [railHeight / 2];
    return items.map((_, index) => (railHeight - 8) * (index / (items.length - 1)));
  }, [items, railHeight]);

  return (
    <div className="rounded-[var(--radius)] border border-border/70 bg-card/60 p-4 shadow-soft">
      <div className="space-y-1">
        <div className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
          Result Rail
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-foreground">
          Page {page} / {totalPages}
        </div>
        <div className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/70">
          {total} results
        </div>
      </div>

      <div ref={railRef} className="relative mt-6 h-[48vh] min-h-[320px]">
        <div className="pointer-events-none absolute inset-y-0 left-2 w-10">
          <svg viewBox="0 0 50 1000" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
            <motion.path
              d={railPath}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.18}
              strokeWidth={1}
              pathLength={1}
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: reduced ? 0 : motionTokens.durations.fast,
                ease: motionTokens.easing.easeOut,
              }}
            />
            <motion.path
              d={railPath}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.5}
              strokeWidth={1}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={reduced ? 0 : 1 - progress}
              transition={{
                duration: reduced ? 0 : motionTokens.durations.fast,
                ease: motionTokens.easing.easeOut,
              }}
            />
          </svg>
        </div>

        {positions.map((y, index) => (
          <div
            key={`${items[index]?.slug ?? index}-${y}`}
            className="absolute left-3 h-2 w-2 -translate-x-1/2 rounded-full border border-border/60 bg-card/80"
            style={{ top: `${y}px` }}
          />
        ))}
      </div>
    </div>
  );
}
