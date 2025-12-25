"use client";

import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export type SectionPosition = {
  id: string;
  y: number;
};

type UseSectionsMapOptions = {
  containerSelector: string;
  sectionSelector: string;
  railRef: RefObject<HTMLElement>;
  minSpacing?: number;
};

export function useSectionsMap({
  containerSelector,
  sectionSelector,
  railRef,
  minSpacing = 12,
}: UseSectionsMapOptions) {
  const [mappedSections, setMappedSections] = useState<SectionPosition[]>([]);
  const [railHeight, setRailHeight] = useState(0);

  const buildMap = useCallback(() => {
    if (typeof window === "undefined") return;
    const railHeightValue = railRef.current?.clientHeight ?? Math.round(window.innerHeight * 0.6);
    const height = Math.max(railHeightValue, 200);
    setRailHeight(height);

    const container = document.querySelector(containerSelector) as HTMLElement | null;
    const scope = container ?? document;
    const sectionNodes = Array.from(scope.querySelectorAll(sectionSelector)) as HTMLElement[];

    if (!sectionNodes.length) {
      setMappedSections([]);
      return;
    }

    const docHeight = Math.max(container?.scrollHeight ?? document.documentElement.scrollHeight, 1);
    const positions = sectionNodes
      .map((section) => {
        const offsetTop = section.offsetTop;
        const y = clamp(offsetTop / docHeight) * height;
        return { id: section.id, y };
      })
      .sort((a, b) => a.y - b.y);

    const spaced: SectionPosition[] = [];
    positions.forEach((item, index) => {
      const previous = spaced[index - 1];
      const nextY = previous ? Math.max(item.y, previous.y + minSpacing) : item.y;
      spaced.push({ id: item.id, y: nextY });
    });

    const last = spaced[spaced.length - 1];
    if (last && last.y > height) {
      const scale = height / last.y;
      setMappedSections(spaced.map((item) => ({ id: item.id, y: item.y * scale })));
      return;
    }

    setMappedSections(spaced);
  }, [containerSelector, minSpacing, railRef, sectionSelector]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame: number | null = null;

    const handle = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        buildMap();
        frame = null;
      });
    };

    handle();
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("resize", handle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [buildMap]);

  return { mappedSections, railHeight };
}
