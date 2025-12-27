"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";

type CurtainStageProps = {
  open: boolean;
  active?: boolean;
  primary: React.ReactNode;
  secondary: React.ReactNode;
  className?: string;
  curtainClassName?: string;
};

export default function CurtainStage({
  open,
  active = false,
  primary,
  secondary,
  className,
  curtainClassName,
}: CurtainStageProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={cn("relative", className)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "secondary" : "primary"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.durations.fast }}
          >
            {open ? secondary : primary}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "secondary" : "primary"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.durations.normal }}
          >
            {open ? secondary : primary}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-card/80 backdrop-blur-sm",
          curtainClassName
        )}
        initial={false}
        animate={{ x: active ? "0%" : "-100%" }}
        transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing.anticipate }}
      />
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-card/80 backdrop-blur-sm",
          curtainClassName
        )}
        initial={false}
        animate={{ x: active ? "0%" : "100%" }}
        transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing.anticipate }}
      />
    </div>
  );
}
