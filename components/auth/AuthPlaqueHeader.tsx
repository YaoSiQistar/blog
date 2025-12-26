"use client";

import { motion } from "motion/react";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";

type AuthPlaqueHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AuthPlaqueHeader({ title, subtitle }: AuthPlaqueHeaderProps) {
  const reduced = useReducedMotion();
  return (
    <div className="space-y-2">
      <motion.h1
        layoutId="auth-title"
        layout
        className="text-2xl font-semibold tracking-tight text-foreground"
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: motionTokens.durations.normal,
                ease: motionTokens.easing.easeOut,
              }
        }
      >
        {title}
      </motion.h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
