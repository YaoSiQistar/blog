"use client";

import * as React from "react";
import { motion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

interface InkRevealProps {
  className?: string;
}

const STORAGE_KEY = "ultra-ink-reveal";

export default function InkReveal({ className }: InkRevealProps) {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
    const stored =
      typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) : "1";
    if (stored === "1") {
      setShouldAnimate(false);
      return;
    }
    setShouldAnimate(true);
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  }, [reduced]);

  if (reduced) {
    return null;
  }

  const opacity =
    motionTokens.transition.inkOpacity +
    (flags.cinema ? motionTokens.ultra.inkOpacityCinemaBoost : 0);
  const cinemaFactor = flags.cinema ? 1.15 : 1;

  return (
    <motion.div
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: shouldAnimate ? opacity : opacity,
        scale: shouldAnimate ? 1 : 1,
      }}
      transition={{
        duration: shouldAnimate ? motionTokens.ultra.inkDuration * cinemaFactor : 0,
        ease: motionTokens.easing.easeOut,
      }}
      style={{
        backgroundImage: `
          radial-gradient(circle at 35% 30%, ${motionTokens.transition.inkColor}, transparent 55%),
          radial-gradient(circle at 70% 55%, ${motionTokens.transition.inkColor}, transparent 60%)
        `,
        maskImage:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(255,255,255,0.1) 70%)",
        mixBlendMode: "multiply",
        filter: "blur(1px)",
      }}
    />
  );
}
