"use client";

import { useRef } from "react";

import type { GuideNode, GuideRailMode } from "@/lib/guide-rail/types";
import { guideRailTokens } from "./tokens";
import { GuideAxis } from "./GuideAxis";
import {
  useGuideActive,
  useGuideMap,
  useGuideNavigate,
  useGuideProgress,
  useReducedMotionGate,
} from "@/hooks/guideRail";

type GuideRailProps = {
  nodes: readonly GuideNode[];
  mode: GuideRailMode;
  containerSelector?: string;
  debug?: boolean;
  variant?: "default" | "rail";
};

export function GuideRail({ nodes, mode, containerSelector }: GuideRailProps) {
  const axisRef = useRef<HTMLDivElement>(null);
  const progress = useGuideProgress(containerSelector);
  const activeId = useGuideActive(nodes, { rootMargin: "-20% 0px -60% 0px" });
  const { mappedNodes, railHeight } = useGuideMap(nodes, {
    railRef: axisRef as React.RefObject<HTMLElement>,
    minSpacing: guideRailTokens.dimension.minNodeGap,
  });
  const { goTo } = useGuideNavigate();
  const { isReduced } = useReducedMotionGate();

  return (
    <aside
      className="flex w-full max-w-[280px] flex-col gap-3 text-[0.75rem] text-muted-foreground"
      style={{
        width: guideRailTokens.dimension.width,
        minWidth: guideRailTokens.dimension.minWidth,
        maxWidth: guideRailTokens.dimension.maxWidth,
      }}
      data-guide-mode={mode}
    >
      <div className="flex items-center">
        <GuideAxis
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
