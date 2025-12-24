"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

import FilmLayer from "@/components/transition/FilmLayer";
import InkLayer from "@/components/transition/InkLayer";
import MotionHUD from "@/components/debug/MotionHUD";
import { motionTokens } from "@/lib/motion/tokens";
import {
  TransitionStageContext,
  TransitionStage,
} from "@/lib/motion/transition-stage";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

// Quiet magazine-style page transition: opacity-only on content; overlays handle the narrative.
const pageVariants = (isReduced: boolean) => ({
  hidden: {
    opacity: isReduced ? 1 : 0.98,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: isReduced ? 0 : motionTokens.transition.enter,
      ease: motionTokens.easing.easeOut,
    },
  },
  exit: {
    opacity: isReduced ? 1 : 0.985,
    transition: {
      duration: isReduced ? 0 : motionTokens.transition.exit,
      ease: motionTokens.easing.easeOut,
    },
  },
});

interface TransitionProviderProps {
  children: React.ReactNode;
}

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const pathname = usePathname();
  const isReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = isReduced || flags.reduced;
  const [stage, setStage] = React.useState<TransitionStage>("idle");
  const stageTimers = React.useRef<number[]>([]);
  const prevPath = React.useRef(pathname);
  const initialized = React.useRef(false);
  const scrollBehavior = React.useRef<string | null>(null);

  const resetTimers = React.useCallback(() => {
    stageTimers.current.forEach((timer) => clearTimeout(timer));
    stageTimers.current = [];
  }, []);

  React.useEffect(() => {
    return () => {
      resetTimers();
    };
  }, [resetTimers]);

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    if (prevPath.current === pathname) {
      return;
    }

    prevPath.current = pathname;
    resetTimers();

    if (reduced) {
      setStage("enter");
      const idleTimer = window.setTimeout(() => setStage("idle"), 40);
      stageTimers.current.push(idleTimer);
      return;
    }

    setStage("exit");

    const exitTimer = window.setTimeout(() => {
      setStage("interlude");

      const interludeTimer = window.setTimeout(() => {
        setStage("enter");

        const enterTimer = window.setTimeout(
          () => setStage("idle"),
          motionTokens.transition.enter * 1000
        );
        stageTimers.current.push(enterTimer);
      }, motionTokens.transition.interlude * 1000);

      stageTimers.current.push(interludeTimer);
    }, motionTokens.transition.exit * 1000);

    stageTimers.current.push(exitTimer);
  }, [pathname, reduced, resetTimers]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    if (scrollBehavior.current === null) {
      scrollBehavior.current = root.style.scrollBehavior;
    }

    if (stage === "idle" || reduced) {
      root.style.scrollBehavior = scrollBehavior.current ?? "";
      return;
    }

    root.style.scrollBehavior = "auto";

    return () => {
      root.style.scrollBehavior = scrollBehavior.current ?? "";
    };
  }, [stage, reduced]);

  return (
    <TransitionStageContext.Provider value={stage}>
      <div className="relative min-h-full">
        <FilmLayer stage={stage} isReduced={reduced} />
        <InkLayer stage={stage} isReduced={reduced} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={pathname}
            variants={pageVariants(reduced)}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10"
            style={{ willChange: "opacity" }}
          >
            {children}
          </motion.section>
        </AnimatePresence>
        <MotionHUD />
      </div>
    </TransitionStageContext.Provider>
  );
}
