import type { Variants } from "motion/react";

import { motionTokens } from "./tokens";
import { withReducedMotion } from "./reduced";

const { durations, easing, limits } = motionTokens;

const fadeBase = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easing.easeOut,
    },
  },
};

export const fadeIn = (isReduced = false): Variants =>
  withReducedMotion(fadeBase, isReduced);

export const fadeUp = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: { opacity: 0, y: limits.enterY },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: durations.normal,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const fadeDown = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: { opacity: 0, y: -limits.enterY },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: durations.normal,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const maskReveal = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
      visible: {
        opacity: 1,
        clipPath: "inset(0 0 0 0)",
        transition: {
          duration: durations.normal,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const staggerContainer = (
  isReduced = false,
  delayChildren = 0,
  step = limits.stagger
): Variants =>
  withReducedMotion(
    {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: isReduced ? 0 : step,
          delayChildren,
        },
      },
    },
    isReduced
  );

export const staggerItem = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: {
        opacity: 0,
        y: limits.enterY / 2,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: durations.fast,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const lineDraw = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: durations.slow,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const modal = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: {
        opacity: 0,
        scale: 0.98,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: durations.fast,
          ease: easing.easeOut,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.96,
        transition: {
          duration: durations.fast,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const shared = (isReduced = false): Variants =>
  withReducedMotion(
    {
      enter: {
        opacity: 1,
        transition: {
          duration: durations.slow,
          ease: easing.easeOut,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: durations.fast,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );

export const pageTransition = (isReduced = false): Variants =>
  withReducedMotion(
    {
      hidden: {
        opacity: 0,
        y: limits.enterY,
        filter: `blur(${limits.blur}px)`,
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: durations.normal,
          ease: easing.easeOut,
        },
      },
      exit: {
        opacity: 0,
        y: -limits.enterY,
        filter: "blur(0px)",
        transition: {
          duration: durations.fast,
          ease: easing.easeOut,
        },
      },
    },
    isReduced
  );
