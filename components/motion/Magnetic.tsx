"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

type MagneticProps = React.HTMLAttributes<HTMLDivElement>;

const springConfig = { stiffness: 300, damping: 30 };

export default function Magnetic({
  children,
  className,
  ...props
}: MagneticProps) {
  const isReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = isReduced || flags.reduced;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const limit = motionTokens.limits.magnetic;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    const offsetX = (relativeX - 0.5) * limit * 2;
    const offsetY = (relativeY - 0.5) * limit * 2;
    rawX.set(offsetX);
    rawY.set(offsetY);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={reduced ? undefined : handleMove}
      onPointerLeave={reduced ? undefined : handleLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}
