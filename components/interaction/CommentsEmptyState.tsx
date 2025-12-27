"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";

type CommentsEmptyStateProps = {
  onFocusComposer: () => void;
};

export default function CommentsEmptyState({ onFocusComposer }: CommentsEmptyStateProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className="rounded-[var(--radius)] border border-border/60 bg-card/50 px-4 py-4 text-sm"
    >
      <p className="font-medium text-foreground">暂无已发布评论。</p>
      <p className="mt-1 text-xs text-muted-foreground">
        你可以成为第一个留言者，审核后将会显示。
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={onFocusComposer}
      >
        写一条评论
      </Button>
    </motion.div>
  );
}
