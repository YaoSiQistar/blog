"use client";

import * as React from "react";
import { MotionValue, motionValue, useScroll, useTransform } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

export interface ScrollDirectorState {
  y: ReturnType<typeof useTransform>;
  opacity: ReturnType<typeof useTransform>;
  blur: MotionValue<number>;
  blurFilter: ReturnType<typeof useTransform>;
  scale: ReturnType<typeof useTransform>;
  progress: ReturnType<typeof useTransform>;
  lineScale: ReturnType<typeof useTransform>;
}

interface ScrollDirectorProps {
  range?: [number, number];
  scrollTarget?: React.RefObject<HTMLElement>;
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
  config,
  children,
}: ScrollDirectorProps) {
  const isReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = isReduced || flags.reduced;

  const { scrollYProgress } = useScroll({ target: scrollTarget });
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
