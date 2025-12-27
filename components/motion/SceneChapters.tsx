"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { rafThrottle } from "@/lib/perf/rafThrottle";
import { useInViewActive } from "@/lib/perf/useInViewActive";

export type SceneChapter = {
  id: string;
  title: string;
  description?: string;
  kicker?: string;
};

type SceneChaptersProps = {
  scenes: SceneChapter[];
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

export default function SceneChapters({ scenes, className }: SceneChaptersProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const reduced = prefersReduced || isMobile;
  const { ref, isActive } = useInViewActive<HTMLDivElement>({ rootMargin: "-20% 0px -20% 0px" });
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [scenes.length]);

  useMotionValueEvent(
    scrollYProgress,
    "change",
    rafThrottle((value) => {
      if (!isActive) return;
      const clamped = Math.min(0.999, Math.max(0, value));
      const nextIndex = Math.floor(clamped * scenes.length);
      setActiveIndex(nextIndex);
    })
  );

  if (reduced) {
    return (
      <section className={cn("space-y-6", className)}>
        {scenes.map((scene) => (
          <div key={scene.id} className="rounded-[var(--radius)] border border-border bg-card/70 p-6">
            {scene.kicker ? (
              <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{scene.kicker}</div>
            ) : null}
            <h3 className="mt-3 text-2xl font-semibold text-foreground">{scene.title}</h3>
            {scene.description ? <p className="mt-2 text-sm text-muted-foreground">{scene.description}</p> : null}
          </div>
        ))}
      </section>
    );
  }

  const activeScene = scenes[Math.min(activeIndex, scenes.length - 1)];

  return (
    <section ref={ref} className={cn("relative", className)}>
      <div ref={sectionRef} style={{ height: `${scenes.length * 100}vh` }}>
        <div className="sticky top-24 flex h-[70vh] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene?.id}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing.easeOut }}
              className="w-[min(640px,90vw)] rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center"
            >
              {activeScene?.kicker ? (
                <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{activeScene.kicker}</div>
              ) : null}
              <h3 className="mt-3 text-3xl font-semibold text-foreground">{activeScene?.title}</h3>
              {activeScene?.description ? (
                <p className="mt-3 text-sm text-muted-foreground">{activeScene.description}</p>
              ) : null}
              <div className="mt-6 h-px w-full bg-border/70" />
              <p className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Chapter {activeIndex + 1} / {scenes.length}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}