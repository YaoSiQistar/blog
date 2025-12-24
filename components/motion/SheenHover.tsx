"use client";

import * as React from "react";
import { motion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

type SheenHoverProps = React.HTMLAttributes<HTMLDivElement>;

export default function SheenHover({
  children,
  className,
  ...props
}: SheenHoverProps) {
  const isReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = isReduced || flags.reduced;
  const opacity = motionTokens.hover.sheenOpacity + (flags.cinema ? motionTokens.ultra.sheenOpacityCinemaBoost : 0);

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {children}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-stretch"
          initial={{ x: "-55%", opacity: 0 }}
          whileHover={{
            x: "120%",
            opacity,
          }}
          transition={{
            duration: flags.cinema ? motionTokens.durations.normal : motionTokens.hover.sheenDuration,
            ease: motionTokens.hover.sheenEase,
          }}
        >
          <span
            className="h-full w-[65%] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-xl"
            style={{ mixBlendMode: "screen" }}
          />
          <span
            className="h-full w-[35%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ transform: "translateX(-20%)" }}
          />
        </motion.span>
      )}
    </div>
  );
}
