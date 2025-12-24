"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useReducedMotion } from "@/lib/motion/reduced";
import type {
  GuideMapMode,
  GuideNode,
  GuideNodePosition,
} from "@/lib/guide-rail/types";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const safeNumber = (value: number | null | undefined, fallback: number) =>
  typeof value === "number" && !Number.isNaN(value) ? value : fallback;

const buildEvenMapping = (
  nodes: GuideNode[],
  height: number,
  minSpacing = 10
): GuideNodePosition[] => {
  if (nodes.length === 0) return [];
  const step = Math.max(height / Math.max(nodes.length - 1, 1), minSpacing);
  return nodes.map((node, index) => ({
    id: node.id,
    y: Math.min(step * index, height),
  }));
};

type UseGuideActiveOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

type UseGuideMapOptions = {
  mode?: GuideMapMode;
  railRef?: RefObject<HTMLElement>;
  minSpacing?: number;
};

type GuideRailFlags = {
  debug: boolean;
  forcedReduced: boolean;
  cinema: boolean;
};

export function useGuideProgress(containerSelector?: string) {
  const [progress, setProgress] = useState(0);

  const compute = useCallback(() => {
    if (typeof window === "undefined") return;
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : document.documentElement;
    if (!container) {
      setProgress(0);
      return;
    }

    const scrollTop = window.scrollY;
    const viewport = window.innerHeight;
    const start = containerSelector
      ? scrollTop + container.getBoundingClientRect().top
      : 0;
    const span = Math.max(container.scrollHeight - viewport, 1);
    const relative = clamp((scrollTop - start) / span);
    setProgress(relative);
  }, [containerSelector]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame: number | null = null;

    const handle = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        compute();
        frame = null;
      });
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [compute]);

  return progress;
}

export function useGuideActive(nodes: GuideNode[], options?: UseGuideActiveOptions) {
  const [activeId, setActiveId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const scrollTargets = nodes.filter(
      (node) => node.target.type === "scroll" && node.target.selector
    );

    if (!scrollTargets.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visible.length) return;

        const id = (visible[0].target as HTMLElement).dataset.guideId;
        if (id) {
          setActiveId(id);
        }
      },
      {
        rootMargin: options?.rootMargin ?? "-20% 0px -60% 0px",
        threshold: options?.threshold ?? [0.25, 0.5, 0.75],
      }
    );

    const observed: HTMLElement[] = [];

    scrollTargets.forEach((node) => {
      const element = document.querySelector(node.target.selector!) as HTMLElement;
      if (!element) return;
      element.dataset.guideId = node.id;
      observer.observe(element);
      observed.push(element);
    });

    return () => {
      observer.disconnect();
      observed.forEach((element) => {
        if (element.dataset.guideId) {
          delete element.dataset.guideId;
        }
      });
    };
  }, [nodes, options?.rootMargin, options?.threshold]);

  return activeId;
}

export function useGuideMap(nodes: GuideNode[], options?: UseGuideMapOptions) {
  const [mappedNodes, setMappedNodes] = useState<GuideNodePosition[]>([]);
  const [railHeight, setRailHeight] = useState(0);
  const minSpacing = options?.minSpacing ?? 10;
  const mode = options?.mode ?? "dom";
  const measuredRailHeight = options?.railRef?.current?.clientHeight;

  const buildMapping = useCallback(() => {
    if (typeof window === "undefined") return;

    const axisHeight = safeNumber(measuredRailHeight, window.innerHeight * 0.65);
    const height = Math.max(axisHeight, 160);
    setRailHeight(height);

    if (mode === "even" || nodes.length === 0) {
      setMappedNodes(buildEvenMapping(nodes, height, minSpacing));
      return;
    }

    const anchor = new Map<string, number>();
    let minTop = Number.POSITIVE_INFINITY;
    let maxTop = Number.NEGATIVE_INFINITY;

    nodes.forEach((node) => {
      if (node.target.type !== "scroll" || !node.target.selector) return;
      const element = document.querySelector(node.target.selector);
      if (!element) return;
      const absolute = window.scrollY + element.getBoundingClientRect().top;
      anchor.set(node.id, absolute);
      minTop = Math.min(minTop, absolute);
      maxTop = Math.max(maxTop, absolute);
    });

    if (!anchor.size) {
      setMappedNodes(buildEvenMapping(nodes, height, minSpacing));
      return;
    }

    const span = Math.max(maxTop - minTop, 1);
    const fallbackStep = Math.max(height / Math.max(nodes.length - 1, 1), minSpacing);

    const entries = nodes.map((node, index) => {
      const targetTop = anchor.get(node.id);
      if (typeof targetTop === "number") {
        const normalized = ((targetTop - minTop) / span) * height;
        return { id: node.id, y: clamp(normalized, 0, height) };
      }

      return { id: node.id, y: Math.min(fallbackStep * index, height) };
    });

    setMappedNodes(entries);
  }, [mode, minSpacing, nodes, measuredRailHeight]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame: number | null = null;

    const handle = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        buildMapping();
        frame = null;
      });
    };

    handle();
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("resize", handle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [buildMapping]);

  return { mappedNodes, railHeight };
}

export function useGuideNavigate() {
  const router = useRouter();

  const highlightTarget = useCallback((target?: HTMLElement) => {
    if (!target || typeof window === "undefined") return;

    if (target.dataset.guideHighlightTimer) {
      window.clearTimeout(Number(target.dataset.guideHighlightTimer));
    }

    target.dataset.guideHighlight = "true";
    const timer = window.setTimeout(() => {
      delete target.dataset.guideHighlight;
      delete target.dataset.guideHighlightTimer;
    }, 320);

    target.dataset.guideHighlightTimer = String(timer);
  }, []);

  const goTo = useCallback(
    (node: GuideNode) => {
      if (node.target.type === "scroll" && node.target.selector) {
        const element = document.querySelector(node.target.selector);
        if (!element) return;
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        highlightTarget(element as HTMLElement);
        return;
      }

      if (node.target.type === "route" && node.target.href) {
        router.push(node.target.href);
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }
      }
    },
    [highlightTarget, router]
  );

  return { goTo };
}

export function useGuideRailFlags(): GuideRailFlags {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") === "1";
  const forcedReduced = searchParams.get("reduced") === "1";
  const cinema = searchParams.get("cinema") === "1";

  return useMemo(
    () => ({
      debug,
      forcedReduced,
      cinema,
    }),
    [cinema, debug, forcedReduced]
  );
}

export function useReducedMotionGate() {
  const { debug, forcedReduced, cinema } = useGuideRailFlags();
  const prefersReduced = useReducedMotion();

  return useMemo(
    () => ({
      isReduced: forcedReduced || prefersReduced,
      debug,
      allowCinema: cinema,
    }),
    [cinema, debug, forcedReduced, prefersReduced]
  );
}
