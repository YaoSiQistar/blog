"use client";

import { Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  favorited: boolean;
  count: number;
  disabled?: boolean;
  onClick: () => void;
};

export default function FavoriteButton({
  favorited,
  count,
  disabled,
  onClick,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={favorited}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition",
        favorited
          ? "border-primary/60 bg-primary/10 text-foreground"
          : "border-border-subtle text-muted-foreground hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <Bookmark className={cn("size-4", favorited && "fill-primary text-primary")} />
      <span>{count}</span>
    </button>
  );
}
