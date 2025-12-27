"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMotionFlags } from "@/lib/flags";
import { useReducedMotion } from "@/lib/motion/reduced";
import { motionTokens } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

import RailHUD from "@/components/debug/RailHUD";
import { useActiveSection } from "@/components/tags/useActiveSection";
import { useSectionsMap } from "@/components/tags/useSectionsMap";

type TopicSection = {
  id: string;
  label: string;
  count: number;
};

type KintsugiTopicRailProps = {
  sections: TopicSection[];
  containerSelector: string;
  sectionSelector: string;
};

const topicRailTokens = {
  line: {
    width: 1,
    baseOpacity: 0.22,
    highlightOpacity: 0.55,
  },
  node: {
    radius: 3.4,
    activeRadius: 5.6,
  },
  motion: {
    draw: 0.28,
    stagger: 0.045,
    nodeIn: 0.18,
  },
};

const railPath =
  "M30 0 C26 140, 34 260, 30 380 S34 640, 28 760 S32 900, 30 1000";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export default function KintsugiTopicRail({
  sections,
  containerSelector,
  sectionSelector,
}: KintsugiTopicRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const { mappedSections, railHeight } = useSectionsMap({
    containerSelector,
    sectionSelector,
    railRef,
    minSpacing: 14,
  });
  const activeId = useActiveSection(sections.map((section) => section.id));
  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) ?? sections[0],
    [activeId, sections]
  );
  const [progress, setProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const flags = useMotionFlags();
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced || flags.reduced;

  const positions = useMemo(() => {
    const map = new Map(mappedSections.map((item) => [item.id, item.y]));
    return map;
  }, [mappedSections]);

  const computeProgress = useCallback(() => {
    if (typeof window === "undefined") return;
    const container = document.querySelector(containerSelector) as HTMLElement | null;
    if (!container) return;

    const scrollTop = window.scrollY;
    const viewport = window.innerHeight;
    const rect = container.getBoundingClientRect();
    const top = scrollTop + rect.top;
    const end = top + container.scrollHeight - viewport;
    const span = Math.max(end - top, 1);
    setProgress(clamp((scrollTop - top) / span));
  }, [containerSelector]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame: number | null = null;
    const handle = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        computeProgress();
        frame = null;
      });
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [computeProgress]);

  const highlightSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.dataset.railHighlight = "true";
    window.setTimeout(() => {
      delete target.dataset.railHighlight;
    }, 320);
  }, []);

  const scrollToSection = useCallback(
    (id: string, closeSheet?: boolean) => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      highlightSection(id);
      if (closeSheet) setSheetOpen(false);
    },
    [highlightSection]
  );

  const list = (
    <div className="space-y-2">
      {sections.map((section) => {
        const isActive = section.id === activeId;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id, true)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border px-4 py-2 text-left text-sm transition",
              isActive
                ? "border-primary/40 bg-card/80 text-foreground"
                : "border-border/70 text-muted-foreground hover:bg-card/70"
            )}
          >
            <span className="font-medium">{section.label}</span>
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/70">
              {section.count}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        <div className="rounded-[var(--radius)] border border-border/70 bg-card/60 p-4 shadow-soft">
          <div className="space-y-1">
            <div className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
              导览目录
            </div>
            <div className="text-xs uppercase tracking-[0.35em] text-foreground">
              {activeSection?.label ?? "-"} - {activeSection?.count ?? 0} 个标签
            </div>
          </div>

          <div ref={railRef} className="relative mt-6 h-[58vh] min-h-[360px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 w-12">
              <svg viewBox="0 0 60 1000" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
                <motion.path
                  d={railPath}
                  fill="none"
                  stroke="var(--primary)"
                  strokeOpacity={topicRailTokens.line.baseOpacity}
                  strokeWidth={topicRailTokens.line.width}
                  pathLength={1}
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: reduced ? 0 : topicRailTokens.motion.draw,
                    ease: motionTokens.easing.easeOut,
                  }}
                />
                <motion.path
                  d={railPath}
                  fill="none"
                  stroke="var(--primary)"
                  strokeOpacity={topicRailTokens.line.highlightOpacity}
                  strokeWidth={topicRailTokens.line.width}
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

            {sections.map((section, index) => {
              const isActive = section.id === activeId;
              const diameter = isActive
                ? topicRailTokens.node.activeRadius * 2
                : topicRailTokens.node.radius * 2;
              const fallbackStep =
                railHeight > 0 ? railHeight / Math.max(sections.length - 1, 1) : 28;
              const y = positions.get(section.id) ?? fallbackStep * index;
              return (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "group absolute left-4 flex items-center justify-center rounded-full border transition",
                    isActive
                      ? "border-primary/40 bg-primary/80 text-primary-foreground"
                      : "border-border/60 bg-card/70 text-foreground/80 hover:border-primary/30"
                  )}
                  style={{ top: `${y}px`, width: `${diameter}px`, height: `${diameter}px` }}
                  initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: reduced ? 0 : topicRailTokens.motion.nodeIn,
                    delay: reduced ? 0 : index * topicRailTokens.motion.stagger,
                    ease: motionTokens.easing.easeOut,
                  }}
                  aria-label={`${section.label} - ${section.count} 个标签`}
                >
                  <span className="sr-only">{section.label}</span>
                  <span
                    className={cn(
                      "pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-full border border-border/70 bg-card/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground shadow-soft transition-opacity",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {section.label} - {section.count} 个标签
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
            <span>进度</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/60 to-accent/40"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] -translate-x-1/2 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div className="rounded-[var(--radius)] border border-border bg-card/80 p-3 shadow-soft backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
                导览目录
              </div>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="rounded-full border border-border/70 bg-background/70 px-4 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-foreground"
                >
                  {activeSection?.label ?? "-"} - {activeSection?.count ?? 0}
                </button>
              </SheetTrigger>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/60 to-accent/40"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
          <SheetContent side="bottom">
            <SheetHeader>
            <SheetTitle>导览目录</SheetTitle>
          </SheetHeader>
          <div className="p-4">{list}</div>
        </SheetContent>
      </Sheet>
    </div>

      <RailHUD
        visible={flags.debug}
        activeId={activeId}
        progress={progress}
        railHeight={railHeight}
        mapped={mappedSections}
      />
    </>
  );
}
