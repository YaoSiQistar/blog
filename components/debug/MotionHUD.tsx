"use client";

import { useEffect, useState } from "react";
import { useScroll } from "motion/react";
import { usePathname } from "next/navigation";

import { useReducedMotion } from "@/lib/motion/reduced";
import { useTransitionStage } from "@/lib/motion/transition-stage";
import { useMotionFlags } from "@/lib/flags";

/*
 * MotionHUD surfaces the current debug stage so ?debugMotion=1 reveals which of the exit/interlude/enter
 * phases is active. It also doubles as the checkpoint to ensure reduced motion toggles reduce overlay
 * behavior instead of running the full timeline that can feel jumpy.
 */
export default function MotionHUD() {
  const flags = useMotionFlags();
  const debug = flags.debug;
  const pathname = usePathname();
  const isReduced = useReducedMotion() || flags.reduced;
  const stage = useTransitionStage();
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setProgress(Number(value.toFixed(3)));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const value = root.dataset.activeSection;
      setActiveSection(value || "hero");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-active-section"] });
    return () => observer.disconnect();
  }, []);

  if (!debug) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-48 rounded-2xl border border-border bg-card/95 p-3 text-[0.65rem] text-muted-foreground shadow-2xl backdrop-blur-sm">
      <p className="font-semibold uppercase tracking-[0.3em]">Motion HUD</p>
      <dl className="mt-2 grid gap-1">
        <div className="flex justify-between">
          <span className="text-[0.55rem] font-semibold text-muted-foreground/80">Route</span>
          <span>{pathname || "/"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[0.55rem] font-semibold text-muted-foreground/80">Reduced</span>
          <span>{isReduced ? "true" : "false"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[0.55rem] font-semibold text-muted-foreground/80">Scroll</span>
          <span>{(progress * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[0.55rem] font-semibold text-muted-foreground/80">Stage</span>
          <span>{stage}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[0.55rem] font-semibold text-muted-foreground/80">Section</span>
          <span>{activeSection}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[0.55rem] font-semibold text-muted-foreground/80">Cinema</span>
          <span>{flags.cinema ? "on" : "off"}</span>
        </div>
      </dl>
    </div>
  );
}
