import { Check, EyeOff } from "lucide-react";
import { motion } from "motion/react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SheenHover from "@/components/motion/SheenHover";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/time/format";
import type { AdminBatchAction, AdminCommentItem } from "@/lib/admin/types";

type QueueRowProps = {
  item: AdminCommentItem;
  postTitle?: string;
  active: boolean;
  checked: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onQuickAction: (action: AdminBatchAction) => void;
};

const statusDot = (status: AdminCommentItem["status"]) => {
  if (status === "approved") return "bg-emerald-400/70";
  if (status === "hidden") return "bg-muted-foreground/40";
  if (status === "spam") return "bg-destructive/60";
  return "bg-primary/80";
};

export default function QueueRow({
  item,
  postTitle,
  active,
  checked,
  onSelect,
  onToggle,
  onQuickAction,
}: QueueRowProps) {
  const label = item.nickname?.trim() || "匿名";
  const relative = formatRelativeTime(item.created_at);

  return (
    <SheenHover className="rounded-[var(--radius)]">
      <motion.div
        layout
        className={cn(
          "group relative flex flex-col gap-3 rounded-[var(--radius)] border border-border/60 bg-card/70 px-4 py-3 transition",
          active ? "border-primary/60 shadow-[inset_0_0_0_1px_rgba(13,59,102,0.2)]" : "hover:border-primary/40"
        )}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSelect();
        }}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={checked}
            onCheckedChange={onToggle}
            onClick={(event) => event.stopPropagation()}
          />
          <span className={cn("h-2 w-2 rounded-full", statusDot(item.status))} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
              <span className="truncate">{label}</span>
              <span>{relative}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-foreground">{item.content}</p>
            <p className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/70">
              {postTitle ?? item.post_slug}
            </p>
          </div>
          <div className="hidden items-center gap-1 opacity-0 transition group-hover:opacity-100 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onQuickAction("approve");
              }}
            >
              <Check className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onQuickAction("hide");
              }}
            >
              <EyeOff className="size-4" />
            </Button>
          </div>
        </div>
        {active ? <span className="absolute left-0 top-4 h-8 w-0.5 bg-primary" /> : null}
      </motion.div>
    </SheenHover>
  );
}
