"use client";

import * as React from "react";
import { MotionValue, motionValue, useScroll, useTransform, type UseScrollOptions } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

export interface ScrollDirectorState {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  blur: MotionValue<number>;
  blurFilter: MotionValue<string>;
  scale: MotionValue<number>;
  progress: MotionValue<number>;
  lineScale: MotionValue<number>;
}

interface ScrollDirectorProps {
  range?: [number, number];
  scrollTarget?: React.RefObject<HTMLElement | null>;
  offset?: [string, string] | [string, string][];
  config?: {
    y?: [number, number];
    opacity?: [number, number];
    blur?: [number, number];
    scale?: [number, number];
    lineScale?: [number, number];
  };
  children: (state: ScrollDirectorState) => React.ReactNode;
}

const createConstantMotionValue = <T,>(value: T) =>
  motionValue(value) as MotionValue<T>;

export default function ScrollDirector({
  range = [0, 0.25],
  scrollTarget,
  offset = ["start start", "end start"],
  config,
  children,
}: ScrollDirectorProps) {
  const isReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = isReduced || flags.reduced;

  const scrollOptions = React.useMemo<UseScrollOptions>(
    () => {
      const opts: UseScrollOptions = {};
      if (scrollTarget) opts.target = scrollTarget;
      if (offset) {
        opts.offset = offset as UseScrollOptions["offset"];
      }
      return opts;
    },
    [offset, scrollTarget]
  );

  const { scrollYProgress } = useScroll(scrollOptions);
  const progress = useTransform(scrollYProgress, range, [0, 1], { clamp: true });
  const yRange = config?.y ?? [24, 0];
  const opacityRange = config?.opacity ?? [0.4, 1];
  const blurRange = config?.blur ?? [motionTokens.limits.blur, 0];
  const scaleRange = config?.scale ?? [0.98, 1];
  const lineScaleRange = config?.lineScale ?? [1, 0.55];

  const y = useTransform(progress, [0, 1], yRange);
  const opacity = useTransform(progress, [0, 1], opacityRange);
  const blur = useTransform(progress, [0, 1], blurRange);
  const blurFilter = useTransform(blur, (value) => `blur(${value}px)`);
  const scale = useTransform(progress, [0, 1], scaleRange);
  const lineScale = useTransform(progress, [0, 1], lineScaleRange);

  const constantY = React.useMemo(() => createConstantMotionValue(0), []);
  const constantOpacity = React.useMemo(() => createConstantMotionValue(1), []);
  const constantBlur = React.useMemo(() => createConstantMotionValue(0), []);
  const constantBlurFilter = React.useMemo(() => createConstantMotionValue("blur(0px)"), []);
  const constantScale = React.useMemo(() => createConstantMotionValue(1), []);
  const constantProgress = React.useMemo(() => createConstantMotionValue(0), []);
  const constantLineScale = React.useMemo(() => createConstantMotionValue(1), []);

  const state = reduced
    ? {
        y: constantY,
        opacity: constantOpacity,
        blur: constantBlur,
        blurFilter: constantBlurFilter,
        scale: constantScale,
        progress: constantProgress,
        lineScale: constantLineScale,
      }
    : { y, opacity, blur, blurFilter, scale, progress, lineScale };

  return <>{children(state)}</>;
}
