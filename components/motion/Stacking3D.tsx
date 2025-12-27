"use client";

import * as React from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useInViewActive } from "@/lib/perf/useInViewActive";
import { rafThrottle } from "@/lib/perf/rafThrottle";

export type StackingCard = {
  id: string;
  title: string;
  subtitle?: string;
};

type Stacking3DProps = {
  cards: StackingCard[];
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

export default function Stacking3D({ cards, className }: Stacking3DProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const reduced = prefersReduced || isMobile;
  const { ref, isActive } = useInViewActive<HTMLDivElement>({ rootMargin: "-15% 0px -15% 0px" });

  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = React.useState(0);

  useMotionValueEvent(
    scrollYProgress,
    "change",
    rafThrottle((value) => {
      if (!isActive) return;
      const clamped = Math.min(0.999, Math.max(0, value));
      const nextIndex = Math.floor(clamped * cards.length);
      setActiveIndex(nextIndex);
    })
  );

  if (reduced) {
    return (
      <section className={cn("space-y-4", className)}>
        {cards.map((card) => (
          <div key={card.id} className="rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Stack</div>
            <h3 className="mt-2 text-xl font-semibold text-foreground">{card.title}</h3>
            {card.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{card.subtitle}</p> : null}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} className={cn("relative", className)}>
      <div ref={sectionRef} style={{ height: `${cards.length * 90}vh` }}>
        <div className="sticky top-24 flex h-[70vh] items-center justify-center">
          <div className="relative w-[min(520px,90vw)]">
            {cards.map((card, index) => {
              const start = index / cards.length;
              const end = (index + 1) / cards.length;
              const rotate = useTransform(scrollYProgress, [start, end], [0, -motionTokens.limits.rotateMax]);
              const baseOffset = index * 14;
              const y = useTransform(scrollYProgress, [start, end], [baseOffset, baseOffset - 24]);
              const scale = useTransform(scrollYProgress, [start, end], [1, 1 + motionTokens.limits.scaleMax]);
              const isCardActive = index === activeIndex;
              return (
                <motion.article
                  key={card.id}
                  className="absolute inset-0 rounded-[var(--radius)] border border-border bg-card/70 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                  style={{
                    translateY: isActive ? y : 0,
                    rotateX: isActive ? rotate : 0,
                    scale: isActive ? scale : 1,
                    transformOrigin: "center top",
                    zIndex: cards.length - index,
                  }}
                >
                  <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Panel</div>
                  <div className={isCardActive ? "opacity-100" : "opacity-0"}>
                    <h3 className="mt-3 text-2xl font-semibold text-foreground">{card.title}</h3>
                    {card.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{card.subtitle}</p> : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
