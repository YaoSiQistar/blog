"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useInViewActive } from "@/lib/perf/useInViewActive";

export type FlyThroughFrame = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  caption?: string;
};

type PerspectiveFlyThroughProps = {
  frames: FlyThroughFrame[];
  depth?: number;
  tilt?: number;
  density?: number;
  mobileFallback?: "stack" | "list";
  className?: string;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isMobile;
};

export default function PerspectiveFlyThrough({
  frames,
  depth = 900,
  tilt = 6,
  density = 1,
  mobileFallback = "stack",
  className,
}: PerspectiveFlyThroughProps) {
  const prefersReduced = useReducedMotion();
  const { ref, isActive } = useInViewActive<HTMLDivElement>({ rootMargin: "-10% 0px -10% 0px" });
  const isMobile = useIsMobile();
  const reduced = prefersReduced || isMobile;

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const travel = depth * density;
  const cameraZ = useTransform(progress, [0, 1], [0, travel]);

  const framesSafe = frames.slice(0, motionTokens.limits.staggerMax);

  if (reduced) {
    return (
      <section className={cn("space-y-4", className)}>
        {framesSafe.map((frame) => (
          <div key={frame.id} className="rounded-(--radius) border border-border bg-card/70 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Gallery</div>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{frame.title}</h3>
            {frame.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{frame.subtitle}</p> : null}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} className={cn("relative", className)}>
      <div ref={scrollRef} className="relative h-[140vh]">
        <div
          className="sticky top-24 h-[70vh] overflow-visible pointer-events-none"
          style={{ perspective: motionTokens.limits.perspective, transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="relative h-full"
            style={{
              transformStyle: "preserve-3d",
              translateZ: isActive ? cameraZ : 0,
            }}
          >
            {framesSafe.map((frame, index) => {
              const step = framesSafe.length > 1 ? index / (framesSafe.length - 1) : 0;
              const z = -travel + travel * step;
              const y = (index % 2 === 0 ? -1 : 1) * 8;
              const rotateY = (index % 2 === 0 ? -1 : 1) * tilt;
              return (
                <motion.article
                  key={frame.id}
                  className="absolute left-1/2 top-1/2 w-[min(460px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius)] border border-border bg-card/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] pointer-events-auto"
                  style={{
                    transformStyle: "preserve-3d",
                    translateZ: z,
                    translateY: y,
                    rotateY,
                  }}
                >
                  {frame.image ? (
                    <img
                      src={frame.image}
                      alt=""
                      className="mb-4 h-40 w-full rounded-(--radius) object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Frame</div>
                  <h3 className="mt-2 text-2xl font-semibold text-foreground">{frame.title}</h3>
                  {frame.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{frame.subtitle}</p> : null}
                  {frame.caption ? <p className="mt-3 text-xs text-muted-foreground/70">{frame.caption}</p> : null}
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>

      {mobileFallback === "list" ? null : (
        <div className="mt-6 h-px w-full bg-border/70" />
      )}
    </section>
  );
}
