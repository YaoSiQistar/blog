"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Size = {
  width: number;
  height: number;
};

type ResizeOptions = {
  disabled?: boolean;
  initialSize?: Size;
};

export function useResizeObserver<T extends HTMLElement>(options: ResizeOptions = {}) {
  const { disabled = false, initialSize = { width: 0, height: 0 } } = options;
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>(initialSize);

  const opts = useMemo(() => ({ disabled }), [disabled]);

  useEffect(() => {
    if (opts.disabled || typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [opts]);

  return { ref, size };
}