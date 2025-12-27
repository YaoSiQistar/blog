"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type InViewOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  disabled?: boolean;
};

export function useInViewActive<T extends HTMLElement>(options: InViewOptions = {}) {
  const { rootMargin = "-10% 0px -10% 0px", threshold = 0.1, once = false, disabled = false } = options;
  const ref = useRef<T | null>(null);
  const [isActive, setIsActive] = useState(false);

  const opts = useMemo(() => ({ rootMargin, threshold, once, disabled }), [rootMargin, threshold, once, disabled]);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    let didUnobserve = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsActive(true);
          if (opts.once && !didUnobserve) {
            observer.unobserve(entry.target);
            didUnobserve = true;
          }
        } else if (!opts.once) {
          setIsActive(false);
        }
      },
      { rootMargin: opts.rootMargin, threshold: opts.threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [opts]);

  return { ref, isActive };
}