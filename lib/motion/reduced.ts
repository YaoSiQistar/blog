"use client";

import { useEffect, useState } from "react";
import type { Variants } from "motion/react";

export function withReducedMotion<V extends Variants>(variant: V, isReduced: boolean): V {
  if (!isReduced) return variant;

  const reduced: Variants = {};
  for (const key in variant) {
    reduced[key] = {
      opacity: key === "hidden" ? 0 : 1,
      transition: { duration: 0 },
    };
  }

  return reduced as V;
}

const motionQuery = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(motionQuery);
    const handleChange = () => setIsReduced(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isReduced;
}

export function useIsReducedMotion(): boolean {
  return useReducedMotion();
}

export function maybeMotion<V extends Variants>(variants: V, reduced: boolean): V {
  return withReducedMotion(variants, reduced);
}
