"use client";

import { motion } from "motion/react";

import type { ApprovedComment } from "@/lib/comments/types";
import { formatAbsoluteTime, formatRelativeTime } from "@/lib/comments/format";
import { useReducedMotion } from "@/lib/motion/reduced";
import { staggerItem } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type CommentItemProps = {
  comment: ApprovedComment;
  animate?: boolean;
};

export default function CommentItem({ comment, animate = true }: CommentItemProps) {
  const reduced = useReducedMotion();
  const name = comment.nickname?.trim() || "Anonymous";
  const initial = name.charAt(0).toUpperCase();
  const relative = formatRelativeTime(comment.created_at);
  const absolute = formatAbsoluteTime(comment.created_at);

  return (
    <motion.article
      variants={animate ? staggerItem(reduced) : undefined}
      className={cn(
        "group flex gap-4 rounded-[var(--radius)] border border-border/60 bg-card/60 px-4 py-4",
        "shadow-[0_12px_30px_-28px_rgba(0,0,0,0.35)]"
      )}
      aria-label={`Comment by ${name}`}
    >
      <div
        className={cn(
          "flex size-11 items-center justify-center rounded-full border border-border/60",
          "bg-background/70 text-xs font-semibold text-muted-foreground"
        )}
        aria-hidden="true"
      >
        {initial}
      </div>
      <div className="min-w-0 space-y-2">
        <header className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={comment.created_at} title={absolute}>
            {relative}
          </time>
        </header>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/80">
          {comment.content}
        </p>
      </div>
    </motion.article>
  );
}
