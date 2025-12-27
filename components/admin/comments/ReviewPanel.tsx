import { Check, EyeOff, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAbsoluteTime, formatRelativeTime } from "@/lib/time/format";
import type { AdminBatchAction, AdminCommentItem } from "@/lib/admin/types";

type ReviewPanelProps = {
  item?: AdminCommentItem;
  postTitle?: string;
  onAction: (action: AdminBatchAction) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

const shorten = (value: string | null) => {
  if (!value) return "-";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function ReviewPanel({
  item,
  postTitle,
  onAction,
  onNext,
  onPrev,
  onClose,
  hasNext,
  hasPrev,
}: ReviewPanelProps) {
  if (!item) {
    return (
      <div className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground">
        请选择一条评论进行审核。
      </div>
    );
  }

  const relative = formatRelativeTime(item.created_at);
  const absolute = formatAbsoluteTime(item.created_at);
  const nickname = item.nickname?.trim() || "Anonymous";

  return (
    <section className="rounded-[var(--radius)] border border-border/70 bg-card/80 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/70">
            审阅面板
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{nickname}</h2>
        </div>
        <Badge variant="secondary" className="rounded-full border-border-subtle bg-card/80">
          {item.status}
        </Badge>
      </div>

      <p className="mt-4 text-base leading-relaxed text-foreground">{item.content}</p>

      <div className="mt-5 space-y-2 text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{postTitle ?? item.post_slug}</span>
          <a
            href={`/posts/${item.post_slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            打开文章
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{absolute}</span>
          <span>{relative}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{item.user_id ? `用户 ${shorten(item.user_id)}` : "访客"}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button onClick={() => onAction("approve")} className="gap-2">
          <Check className="size-4" />
          通过
        </Button>
        <Button variant="secondary" onClick={() => onAction("hide")} className="gap-2">
          <EyeOff className="size-4" />
          隐藏
        </Button>
        <Button variant="ghost" onClick={() => onAction("spam")} className="gap-2">
          <ShieldAlert className="size-4" />
          垃圾
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
        <Button variant="ghost" size="sm" disabled={!hasPrev} onClick={onPrev}>
          上一条
        </Button>
        <Button variant="ghost" size="sm" disabled={!hasNext} onClick={onNext}>
          下一条
        </Button>
        {onClose ? (
          <Button variant="ghost" size="sm" onClick={onClose}>
            关闭
          </Button>
        ) : null}
      </div>
    </section>
  );
}
