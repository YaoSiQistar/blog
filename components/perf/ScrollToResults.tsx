"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useReducedMotion } from "@/lib/motion/reduced";

type ScrollToResultsProps = {
  targetId: string;
};

export default function ScrollToResults({ targetId }: ScrollToResultsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const initialRef = React.useRef<string | null>(null);

  const key = `${pathname}?${searchParams?.toString() ?? ""}`;

  React.useEffect(() => {
    if (!searchParams) return;

    if (initialRef.current === null) {
      initialRef.current = key;
      return;
    }

    if (initialRef.current === key) return;
    initialRef.current = key;

    const el = document.getElementById(targetId);
    if (!el) return;

    el.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [key, reducedMotion, searchParams, targetId]);

  return null;
}

