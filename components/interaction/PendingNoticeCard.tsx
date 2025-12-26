"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/motion/reduced";
import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type PendingNoticeCardProps = {
  onDismiss: () => void;
};

export default function PendingNoticeCard({ onDismiss }: PendingNoticeCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-[var(--radius)] border border-border/70 bg-background/70 px-4 py-3",
        "backdrop-blur-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Submitted</p>
          <p className="text-xs text-muted-foreground">
            Your note is pending review and will appear once approved.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          aria-label="Dismiss pending notice"
        >
          <X className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
