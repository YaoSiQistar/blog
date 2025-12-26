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
      <p className="font-medium text-foreground">No published notes yet.</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Be the first to leave a note - it will appear after review.
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={onFocusComposer}
      >
        Write a note
      </Button>
    </motion.div>
  );
}
