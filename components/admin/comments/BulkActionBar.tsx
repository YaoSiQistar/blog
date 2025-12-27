import { motion } from "motion/react";
import { Check, EyeOff, ShieldAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

type BulkActionBarProps = {
  count: number;
  onApprove: () => void;
  onHide: () => void;
  onSpam: () => void;
  onClear: () => void;
  className?: string;
  visible?: boolean;
};

export default function BulkActionBar({
  count,
  onApprove,
  onHide,
  onSpam,
  onClear,
  className,
  visible = true,
}: BulkActionBarProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const isVisible = Boolean(visible);

  return (
    <motion.div
      initial={false}
      animate={
        reduced
          ? { y: 0, opacity: 1 }
          : isVisible
            ? { y: 0, opacity: 1 }
            : { y: 12, opacity: 0 }
      }
      transition={{ duration: reduced ? 0 : 0.2 }}
      className={cn(
        "fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/70 bg-card/90 px-4 py-2 shadow-soft backdrop-blur",
        className
      )}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
      aria-hidden={!isVisible}
    >
      <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
        已选 {count}
      </span>
      <Button size="sm" onClick={onApprove} className="gap-2">
        <Check className="size-4" />
        通过
      </Button>
      <Button variant="secondary" size="sm" onClick={onHide} className="gap-2">
        <EyeOff className="size-4" />
        隐藏
      </Button>
      <Button variant="ghost" size="sm" onClick={onSpam} className="gap-2">
        <ShieldAlert className="size-4" />
        垃圾
      </Button>
      <Button variant="ghost" size="icon" onClick={onClear}>
        <X className="size-4" />
      </Button>
    </motion.div>
  );
}
