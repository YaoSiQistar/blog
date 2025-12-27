"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useReducedMotion } from "@/lib/motion/reduced";
import type { KintsugNode, KintsugNodePosition } from "@/lib/Kintsug-rail/types";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

type UseKintsugActiveOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

type UseKintsugMapOptions = {
  railRef?: RefObject<HTMLElement>;
  minSpacing?: number;
  containerSelector?: string;
};

type KintsugRailFlags = {
  forcedReduced: boolean;
  cinema: boolean;
};

export function useKintsugProgress(containerSelector?: string) {
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

    if (!containerSelector) {
      const span = Math.max(container.scrollHeight - viewport, 1);
      setProgress(clamp(scrollTop / span));
      return;
    }

    const rect = (container as HTMLElement).getBoundingClientRect();
    const containerTop = scrollTop + rect.top;
    const containerHeight = (container as HTMLElement).scrollHeight || rect.height;
    const start = containerTop - viewport * 0.15;
    const end = containerTop + containerHeight - viewport * 0.55;
    const span = Math.max(end - start, 1);
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

export function useKintsugActive(nodes: readonly KintsugNode[], options?: UseKintsugActiveOptions) {
  const [activeId, setActiveId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!nodes.length) {
      const frame = window.requestAnimationFrame(() => setActiveId(undefined));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [nodes.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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

        if (!visible.length) {
          return;
        }

        const id = (visible[0].target as HTMLElement).dataset.kintsugId;
        if (id) {
          setActiveId(id);
        }
      },
      {
        rootMargin: options?.rootMargin ?? "-30% 0px -60% 0px",
        threshold: options?.threshold ?? 0,
      }
    );

    const observed: HTMLElement[] = [];

    scrollTargets.forEach((node) => {
      const element = document.querySelector(node.target.selector!) as HTMLElement;
      if (!element) return;
      element.dataset.kintsugId = node.id;
      observer.observe(element);
      observed.push(element);
    });

    return () => {
      observer.disconnect();
      observed.forEach((element) => {
        if (element.dataset.kintsugId) {
          delete element.dataset.kintsugId;
        }
      });
    };
  }, [nodes, options?.rootMargin, options?.threshold]);

  return activeId;
}

export function useKintsugMap(nodes: readonly KintsugNode[], options?: UseKintsugMapOptions) {
  const { railRef, minSpacing: optionMinSpacing, containerSelector } = options ?? {};
  const [mappedNodes, setMappedNodes] = useState<KintsugNodePosition[]>([]);
  const [railHeight, setRailHeight] = useState(0);
  const minSpacing = optionMinSpacing ?? 12;
  const resolveSpacing = (height: number, count: number) =>
    Math.min(minSpacing, height / Math.max(count - 1, 1));

  const buildMapping = useCallback(() => {
    if (typeof window === "undefined") return;

    const axisElement = railRef?.current;
    const axisHeight = axisElement?.clientHeight ?? window.innerHeight * 0.6;
    const height = Math.max(axisHeight, 180);
    setRailHeight(height);

    if (!nodes.length) {
      setMappedNodes([]);
      return;
    }

    const anchor = new Map<string, number>();
    let minTop = Number.POSITIVE_INFINITY;
    let maxTop = Number.NEGATIVE_INFINITY;

    const container =
      containerSelector && typeof document !== "undefined"
        ? document.querySelector(containerSelector)
        : document.querySelector("article");

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
      const spacing = resolveSpacing(height, nodes.length);
      setMappedNodes(
        nodes.map((node, index) => ({
          id: node.id,
          y: Math.min(spacing * index, height),
        }))
      );
      return;
    }

    const containerTop = container ? window.scrollY + (container as HTMLElement).getBoundingClientRect().top : minTop;
    const containerHeight = container ? (container as HTMLElement).scrollHeight : Math.max(maxTop - minTop, 1);
    const span = Math.max(containerHeight, 1);
    const spacing = resolveSpacing(height, nodes.length);

    const rawPositions = nodes.map((node, index) => {
      const targetTop = anchor.get(node.id);
      if (typeof targetTop === "number") {
        const normalized = ((targetTop - containerTop) / span) * height;
        return { id: node.id, y: clamp(normalized, 0, height) };
      }
      return { id: node.id, y: Math.min(spacing * index, height) };
    });

    const sorted = [...rawPositions].sort((a, b) => a.y - b.y);
    for (let i = 1; i < sorted.length; i += 1) {
      sorted[i].y = Math.max(sorted[i].y, sorted[i - 1].y + spacing);
    }
    if (sorted.length > 1 && sorted[sorted.length - 1].y > height) {
      sorted[sorted.length - 1].y = height;
      for (let i = sorted.length - 2; i >= 0; i -= 1) {
        sorted[i].y = Math.min(sorted[i].y, sorted[i + 1].y - spacing);
      }
      if (sorted[0].y < 0) {
        const shift = -sorted[0].y;
        sorted.forEach((node) => {
          node.y = Math.min(node.y + shift, height);
        });
      }
    }

    const adjusted = new Map(sorted.map((node) => [node.id, node.y]));
    setMappedNodes(rawPositions.map((node) => ({ id: node.id, y: adjusted.get(node.id) ?? node.y })));
  }, [nodes, minSpacing, railRef, containerSelector]);

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

export function useKintsugNavigate() {
  const router = useRouter();

  const highlightTarget = useCallback((target?: HTMLElement) => {
    if (!target || typeof window === "undefined") return;

    if (target.dataset.kintsugHighlightTimer) {
      window.clearTimeout(Number(target.dataset.kintsugHighlightTimer));
    }

    target.dataset.kintsugHighlight = "true";
    const timer = window.setTimeout(() => {
      delete target.dataset.kintsugHighlight;
      delete target.dataset.kintsugHighlightTimer;
    }, 320);

    target.dataset.kintsugHighlightTimer = String(timer);
  }, []);

  const goTo = useCallback(
    (node: KintsugNode) => {
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

export function useKintsugRailFlags(): KintsugRailFlags {
  const searchParams = useSearchParams();
  const forcedReduced = searchParams.get("reduced") === "1";
  const cinema = searchParams.get("cinema") === "1";

  return useMemo(
    () => ({
      forcedReduced,
      cinema,
    }),
    [cinema, forcedReduced]
  );
}

export function useReducedMotionGate() {
  const { forcedReduced, cinema } = useKintsugRailFlags();
  const prefersReduced = useReducedMotion();

  return useMemo(
    () => ({
      isReduced: forcedReduced || prefersReduced,
      allowCinema: cinema,
    }),
    [cinema, forcedReduced, prefersReduced]
  );
}
