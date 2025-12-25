"use client";

import type { KintsugNode } from "@/lib/Kintsug-rail/types";
import { cn } from "@/lib/utils";
import { KintsugRailTokens } from "./tokens";

type KintsugListProps = {
  nodes: KintsugNode[];
  activeId?: string;
  goTo: (node: KintsugNode) => void;
};

export function KintsugList({ nodes, activeId, goTo }: KintsugListProps) {
  if (!nodes.length) return null;

  return (
    <ul className="space-y-2 text-[0.75rem] text-muted-foreground">
      {nodes.map((node) => {
        const isActive = node.id === activeId;
        const isVisited = node.meta?.visited;
        const isDisabled = node.meta?.disabled;

        return (
          <li key={node.id}>
            <button
              type="button"
              title={node.meta?.subtitle ?? node.label}
              disabled={isDisabled}
              onClick={() => goTo(node)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 transition",
                isActive ? "border-primary/60 bg-card/80 text-foreground" : "border-border-subtle bg-transparent",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "hover:bg-card/70"
              )}
            >
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "block h-5 w-0.5 rounded-full",
                      isActive
                        ? "bg-primary"
                        : isVisited
                        ? "bg-muted-foreground"
                        : "bg-muted-foreground/50"
                    )}
                  />
                  <span
                    className={cn(
                      "block",
                      isActive ? KintsugRailTokens.typography.activeLabel : KintsugRailTokens.typography.label,
                      isActive ? "text-foreground" : "text-muted-foreground/90"
                    )}
                  >
                    {node.label}
                  </span>
                </span>
                {node.meta?.subtitle && (
                  <span className="mt-0.5 block text-[0.6rem] text-muted-foreground/70">
                    {node.meta.subtitle}
                  </span>
                )}
              </span>
              {typeof node.meta?.count === "number" && (
                <span className="text-[0.65rem] text-muted-foreground/80">{node.meta.count}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
