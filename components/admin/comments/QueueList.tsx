import { motion } from "motion/react";

import { staggerContainer, staggerItem } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import type { AdminBatchAction, AdminCommentItem } from "@/lib/admin/types";
import type { PostsIndexMap } from "@/lib/content/postsIndex";
import QueueRow from "./QueueRow";

type QueueListProps = {
  items: AdminCommentItem[];
  selectedId?: string;
  selectedIds: Set<string>;
  postIndex: PostsIndexMap;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onQuickAction: (id: string, action: AdminBatchAction) => void;
};

export default function QueueList({
  items,
  selectedId,
  selectedIds,
  postIndex,
  onSelect,
  onToggle,
  onQuickAction,
}: QueueListProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground">
        当前队列暂无评论。
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer(reduced, 0, 0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={staggerItem(reduced)}>
          <QueueRow
            item={item}
            postTitle={postIndex[item.post_slug]?.title}
            active={item.id === selectedId}
            checked={selectedIds.has(item.id)}
            onSelect={() => onSelect(item.id)}
            onToggle={() => onToggle(item.id)}
            onQuickAction={(action) => onQuickAction(item.id, action)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
