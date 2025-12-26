"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

type LikeButtonProps = {
  liked: boolean;
  count: number;
  disabled?: boolean;
  onClick: () => void;
};

export default function LikeButton({ liked, count, disabled, onClick }: LikeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={liked}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition",
        liked
          ? "border-primary/60 bg-primary/10 text-foreground"
          : "border-border-subtle text-muted-foreground hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <Heart className={cn("size-4", liked && "fill-primary text-primary")} />
      <span>{count}</span>
    </button>
  );
}
