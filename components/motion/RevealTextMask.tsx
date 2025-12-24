"use client";

import * as React from "react";
import { motion } from "motion/react";

import { maskReveal } from "@/lib/motion/variants";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

type Mode = "lines" | "words";

interface RevealTextMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  mode?: Mode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  stagger?: number;
}

const splitWords = (text: string) => {
  const containsCJK = /\p{Script=Han}/u.test(text);
  if (containsCJK) {
    return Array.from(text);
  }

  const segments = text.split(/(\s+)/).filter(Boolean);
  if (segments.length === 0) {
    return Array.from(text);
  }
  return segments;
};

export default function RevealTextMask({
  text,
  mode = "lines",
  as: Component = "div",
  delay = 0,
  stagger,
  className,
  ...props
}: RevealTextMaskProps) {
  const isReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = isReduced || flags.reduced;
  const tempo = flags.cinema ? motionTokens.durations.slow : motionTokens.durations.normal;

  if (reduced) {
    return (
      <Component className={cn("text-current", className)} {...props}>
        {text}
      </Component>
    );
  }

  const words = splitWords(text);
  const step = stagger ?? motionTokens.limits.stagger;
  const variant = maskReveal();

  if (mode === "lines") {
    return (
      <Component
        className={cn("overflow-hidden text-current", className)}
        {...props}
      >
        <motion.span
          className="inline-block"
          variants={variant}
          initial="hidden"
          animate="visible"
          transition={{ delay, duration: tempo }}
        >
          {text}
        </motion.span>
      </Component>
    );
  }

  return (
    <Component
      className={cn("inline-flex flex-wrap gap-[0.125rem] overflow-hidden text-current", className)}
      {...props}
    >
      {words.map((segment, index) => {
        const isSpace = /^\s+$/.test(segment);
        return (
          <motion.span
            key={`${segment}-${index}`}
            className={cn(
              "inline-block",
              isSpace ? "w-1" : ""
            )}
            variants={variant}
            initial="hidden"
            animate="visible"
            transition={{
              delay: delay + index * step,
              duration: flags.cinema ? motionTokens.durations.normal : motionTokens.durations.fast,
            }}
          >
            {segment}
          </motion.span>
        );
      })}
    </Component>
  );
}
