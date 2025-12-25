"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";

import type { KintsugNode, KintsugNodePosition, KintsugRailMode } from "@/lib/Kintsug-rail/types";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { KintsugRailTokens } from "./tokens";

const heroPathD =
  "M60 0 C54 80, 68 140, 58 220 S64 360, 52 440 S66 600, 58 720 S70 880, 60 1000";

type KintsugAxisProps = {
  nodes: KintsugNode[];
  activeId?: string;
  mappedNodes: KintsugNodePosition[];
  railHeight: number;
  goTo: (node: KintsugNode) => void;
  progress: number;
  railRef: RefObject<HTMLDivElement>;
  reduced?: boolean;
  mode: KintsugRailMode;
  showLabels?: boolean;
};

export function KintsugAxis({
  nodes,
  activeId,
  mappedNodes,
  railHeight,
  goTo,
  progress,
  railRef,
  reduced,
  mode,
  showLabels = false,
}: KintsugAxisProps) {
  const positions = new Map(mappedNodes.map((node) => [node.id, node.y]));
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const alignLeft = mode === "reading";
  const baseStroke = KintsugRailTokens.dimension.lineStroke;
  const heightClass =
    mode === "hero"
      ? "h-[70vh] min-h-[420px]"
      : mode === "reading"
      ? "h-[68vh] min-h-[420px]"
      : "h-[58vh] min-h-[360px]";

  return (
    <div
      ref={railRef}
      className={cn("relative flex-1", heightClass)}
      aria-hidden
      data-kintsug-mode={mode}
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <svg viewBox="0 0 120 1000" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
          <path
            d={heroPathD}
            fill="none"
            stroke={KintsugRailTokens.colors.line}
            strokeWidth={baseStroke}
            strokeLinecap="round"
          />
          <motion.path
            d={heroPathD}
            fill="none"
            stroke={KintsugRailTokens.colors.lineHighlight}
            strokeWidth={baseStroke + 0.45}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={reduced ? 0 : 1 - clampedProgress}
            transition={{
              duration: reduced ? 0 : motionTokens.durations.fast,
              ease: motionTokens.easing.easeOut,
            }}
          />
        </svg>
      </div>

      {nodes.map((node) => {
        const isActive = node.id === activeId;
        const isVisited = Boolean(node.meta?.visited);
        const isDisabled = Boolean(node.meta?.disabled);
        const baselineRadius =
          node.level === 2
            ? KintsugRailTokens.dimension.nodeRadius.sub
            : KintsugRailTokens.dimension.nodeRadius.default;
        const radius = isActive ? KintsugRailTokens.dimension.nodeRadius.active : baselineRadius;
        const diameter = radius * 2;
        const rawY = positions.get(node.id) ?? 0;
        const topValue = Math.min(Math.max(rawY, 0), Math.max(railHeight, diameter));
        const showLabel = showLabels && (node.level !== 2 || isActive);

        return (
          <div
            key={node.id}
            className={cn("absolute z-20", alignLeft ? "left-1" : "left-1/2 -translate-x-1/2")}
            style={{ top: `${topValue}px` }}
          >
            <button
              type="button"
              onClick={() => !isDisabled && goTo(node)}
              disabled={isDisabled}
              className={cn(
                "pointer-events-auto rounded-full border transition",
                isActive ? "border-primary/40 shadow-[0_0_0_3px_var(--ring)]" : "border-transparent",
                isDisabled ? "opacity-30" : "opacity-65 hover:opacity-95",
                isActive && "opacity-100"
              )}
              style={{
                width: `${diameter}px`,
                height: `${diameter}px`,
                background: isActive
                  ? KintsugRailTokens.colors.nodeActive
                  : isVisited
                  ? KintsugRailTokens.colors.nodeVisited
                  : KintsugRailTokens.colors.node,
              }}
              aria-label={node.meta?.subtitle ?? node.label}
              aria-current={isActive ? "true" : undefined}
              data-state={isDisabled ? "disabled" : isActive ? "active" : isVisited ? "visited" : "default"}
              title={node.meta?.subtitle ?? node.label}
            />
            {showLabel && (
              <span
                className={cn(
                  "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3",
                  "max-w-[10rem] truncate",
                  isActive ? "text-foreground" : "text-muted-foreground/80",
                  isActive ? KintsugRailTokens.typography.activeLabel : KintsugRailTokens.typography.label
                )}
              >
                {node.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
