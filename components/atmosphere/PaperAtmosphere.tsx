"use client";

import * as React from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

interface PaperAtmosphereProps {
  className?: string;
}

const getDaylightTint = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "rgba(245, 246, 255, 0.03)";
  if (hour >= 12 && hour < 18) return "rgba(255, 248, 240, 0.03)";
  return "rgba(244, 240, 232, 0.03)";
};

export default function PaperAtmosphere({ className }: PaperAtmosphereProps) {
  const flags = useMotionFlags();
  const reduced = useReducedMotion() || flags.reduced;
  const daylightTint = React.useMemo(() => getDaylightTint(), []);
  const driftDuration = flags.cinema ? 14 : 18;

  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.55), transparent 55%),
            radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.2), transparent 48%),
            radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.12), transparent 55%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0))
          `,
          backgroundSize: "220% 220%, 200% 200%, 200% 200%, 100% 100%",
          backgroundPosition: "0% 0%, 100% 0%, 50% 50%, 0% 0%",
        }}
        animate={
          reduced
            ? undefined
            : {
                backgroundPosition: [
                  "0% 0%, 100% 0%, 50% 50%, 0% 0%",
                  "30% 15%, 70% 10%, 45% 60%, 0% 0%",
                  "0% 0%, 100% 0%, 50% 50%, 0% 0%",
                ],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: driftDuration,
                ease: "linear",
                repeat: Infinity,
              }
        }
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, var(--paper-noise-opacity)), rgba(255, 255, 255, 0)) 1px 1px",
          backgroundSize: "3px 3px",
          opacity: "var(--paper-noise-opacity)",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(0, 0, 0, var(--paper-vignette-opacity)), transparent 45%), radial-gradient(circle at 85% 100%, rgba(0, 0, 0, calc(var(--paper-vignette-opacity) * 0.6)), transparent 60%)",
          mixBlendMode: "soft-light",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: daylightTint,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
