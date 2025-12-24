"use client";

import type { GuideNodePosition, GuideRailMode } from "@/lib/guide-rail/types";

type GuideHUDProps = {
  mode: GuideRailMode;
  activeId?: string;
  progress: number;
  railHeight: number;
  mappedNodes: GuideNodePosition[];
};

export function GuideHUD({ mode, activeId, progress, railHeight, mappedNodes }: GuideHUDProps) {
  const percent = Math.round(progress * 100);
  const nodesPreview = mappedNodes.slice(0, 4).map((node) => `${node.id}@${Math.round(node.y)}`);

  return (
    <div className="outline-none pointer-events-none select-none rounded-lg border border-border-subtle bg-card/60 p-3 text-[0.65rem] text-muted-foreground shadow-soft backdrop-blur-sm">
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">Guide HUD</div>
      <div className="space-y-1 pt-2">
        <div className="flex justify-between text-xs text-foreground/70">
          <span>Mode</span>
          <span className="font-semibold text-foreground">{mode}</span>
        </div>
        <div className="flex justify-between text-xs text-foreground/70">
          <span>Active</span>
          <span className="font-semibold text-foreground">{activeId ?? "-"}</span>
        </div>
        <div className="flex justify-between text-xs text-foreground/70">
          <span>Progress</span>
          <span className="font-semibold text-foreground">{percent}%</span>
        </div>
        <div className="flex justify-between text-xs text-foreground/70">
          <span>Rail</span>
          <span className="font-semibold text-foreground">{Math.round(railHeight)}px</span>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Nodes</span>: {nodesPreview.join(", ") || "none"}
        </div>
      </div>
    </div>
  );
}
