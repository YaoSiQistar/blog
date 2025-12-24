"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

interface KintsugiLineProps {
  sectionIds: string[];
  className?: string;
}

const pathD =
  "M60 0 C54 80, 68 140, 58 220 S64 360, 52 440 S66 600, 58 720 S70 880, 60 1000";

export default function KintsugiLine({ sectionIds, className }: KintsugiLineProps) {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;
  const { scrollYProgress } = useScroll();
  const scrollLength = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const [drawn, setDrawn] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(sectionIds[0] ?? "hero");

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.activeSection = activeSection;
  }, [activeSection]);

  React.useEffect(() => {
    if (sectionIds.length === 0) return;
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [sectionIds]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-6 top-0 z-10 hidden h-full w-[120px] lg:block",
        className
      )}
    >
      <svg
        viewBox="0 0 120 1000"
        className="h-full w-full"
        aria-hidden="true"
      >
        {!reduced && (
          <motion.path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 0.4, opacity: 1 }}
            transition={{
              delay: motionTokens.ultra.lineDrawDelay,
              duration: motionTokens.ultra.lineDrawDuration,
              ease: motionTokens.easing.easeOut,
            }}
            className="text-primary/60"
            onAnimationComplete={() => setDrawn(true)}
          />
        )}
        <motion.path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{
            pathLength: reduced ? 1 : scrollLength,
            opacity: reduced ? 0.4 : drawn ? 1 : 0,
          }}
          className="text-primary/60"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-between py-10 text-[0.55rem] uppercase tracking-[0.4em] text-muted-foreground">
        {sectionIds.map((id) => (
          <span
            key={id}
            className={
              id === activeSection
                ? "text-primary"
                : "text-muted-foreground/70"
            }
          >
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}
