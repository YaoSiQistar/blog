"use client";

import { useRef } from "react";

import type { KintsugNode, KintsugRailMode } from "@/lib/Kintsug-rail/types";
import { cn } from "@/lib/utils";
import { KintsugRailTokens } from "./tokens";
import { KintsugAxis } from "./KintsugAxis";
import {
  useKintsugActive,
  useKintsugMap,
  useKintsugNavigate,
  useKintsugProgress,
  useReducedMotionGate,
} from "@/hooks/KintsugRail";

type KintsugRailProps = {
  nodes: readonly KintsugNode[];
  mode: KintsugRailMode;
  containerSelector?: string;
  debug?: boolean;
  variant?: "default" | "rail" | "compact";
  spacing?: number;
  className?: string;
};

export function KintsugRail({
  nodes,
  mode,
  containerSelector,
  spacing,
  variant = "default",
  className,
}: KintsugRailProps) {
  const axisRef = useRef<HTMLDivElement>(null);
  const progress = useKintsugProgress(containerSelector);
  const activeId = useKintsugActive(nodes);
  const { mappedNodes, railHeight } = useKintsugMap(nodes, {
    railRef: axisRef as React.RefObject<HTMLElement>,
    minSpacing: spacing ?? KintsugRailTokens.dimension.minNodeGap,
  });
  const { goTo } = useKintsugNavigate();
  const { isReduced } = useReducedMotionGate();
  const sizeTokens =
    variant === "compact" ? KintsugRailTokens.dimension.compact : KintsugRailTokens.dimension;

  return (
    <aside
      className={cn(
        "flex w-full flex-col gap-3 text-[0.75rem] text-muted-foreground",
        variant === "compact" ? "max-w-[200px]" : "max-w-[280px]",
        className
      )}
      style={{
        width: sizeTokens.width,
        minWidth: sizeTokens.minWidth,
        maxWidth: sizeTokens.maxWidth,
      }}
      data-kintsug-mode={mode}
    >
      <div className="flex items-center">
        <KintsugAxis
          nodes={nodes}
          activeId={activeId}
          mappedNodes={mappedNodes}
          railHeight={railHeight}
          goTo={goTo}
          progress={progress}
          railRef={axisRef as React.RefObject<HTMLDivElement>}
          reduced={isReduced}
          mode={mode}
          showLabels
        />
      </div>
    </aside>
  );
}
