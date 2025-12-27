"use client";

import { motion } from "motion/react";

import type { PosterRatio, PosterStyleGroup, PosterStyleId } from "@/lib/poster/styles";
import { cn } from "@/lib/utils";

type StyleCardProps = {
  style: {
    id: PosterStyleId;
    name: string;
    group: PosterStyleGroup;
    description: string;
  };
  slug: string;
  ratio: PosterRatio;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export default function StyleCard({
  style,
  slug,
  ratio,
  active,
  onSelect,
  onHover,
}: StyleCardProps) {
  const previewSrc = `/api/poster/posts/${slug}?style=${style.id}&ratio=${ratio}&size=thumb`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onPointerEnter={onHover}
      className={cn(
        "snap-start text-left",
        "min-w-[220px] rounded-[var(--radius)] border border-border bg-card/60 p-3",
        "transition hover:border-foreground/40"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-background/70">
          <img
            src={previewSrc}
            alt={`${style.name} 预览`}
            className="h-28 w-full object-cover"
            loading="lazy"
          />
          {active ? (
            <div className="absolute right-2 top-2 rounded-full border border-border bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-foreground">
              已选
            </div>
          ) : null}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{style.name}</div>
          <div className="text-xs text-muted-foreground">{style.description}</div>
        </div>
      </div>
    </motion.button>
  );
}
