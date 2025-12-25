"use client";

import { useEffect, useState } from "react";

type UseActiveSectionOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

export function useActiveSection(sectionIds: string[], options?: UseActiveSectionOptions) {
  const [activeId, setActiveId] = useState<string | undefined>(sectionIds[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionIds.length) {
      setActiveId(undefined);
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) {
      setActiveId(sectionIds[0]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visible.length) return;
        const next = (visible[0].target as HTMLElement).id;
        setActiveId(next);
      },
      {
        rootMargin: options?.rootMargin ?? "-30% 0px -60% 0px",
        threshold: options?.threshold ?? 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold, sectionIds]);

  return activeId;
}
