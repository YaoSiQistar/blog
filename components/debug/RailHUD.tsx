"use client";

import { cn } from "@/lib/utils";

type RailHUDProps = {
  activeId?: string;
  progress: number;
  railHeight: number;
  mapped: { id: string; y: number }[];
  visible?: boolean;
};

export default function RailHUD({
  activeId,
  progress,
  railHeight,
  mapped,
  visible = false,
}: RailHUDProps) {
  if (!visible) return null;

  const preview = mapped.slice(0, 6).map((item) => `${item.id}:${Math.round(item.y)}`);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-[240px] rounded-[var(--radius)] border border-border bg-card/80 p-4 text-[0.65rem] text-muted-foreground shadow-soft backdrop-blur-sm"
      )}
    >
      <div className="text-[0.55rem] uppercase tracking-[0.45em] text-muted-foreground/80">
        Rail HUD
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span>Active</span>
          <span className="font-semibold text-foreground">{activeId ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Progress</span>
          <span className="font-semibold text-foreground">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rail</span>
          <span className="font-semibold text-foreground">
            {Math.round(railHeight)}px
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Sections</span>
          <span className="font-semibold text-foreground">{mapped.length}</span>
        </div>
        <div className="text-[0.6rem] text-muted-foreground/80">
          <span className="font-semibold text-foreground">Map</span>: {preview.join(", ") || "none"}
        </div>
      </div>
    </div>
  );
}
