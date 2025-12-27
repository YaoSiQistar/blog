"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { commentLimits, commentSchema } from "@/lib/comments/validators";
import { submitComment } from "@/lib/comments/client";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { cn } from "@/lib/utils";
import PendingNoticeCard from "./PendingNoticeCard";

type CommentComposerProps = {
  postSlug: string;
  viewer?: { userId?: string | null };
  textareaId?: string;
};

export default function CommentComposer({
  postSlug,
  viewer,
  textareaId,
}: CommentComposerProps) {
  const reduced = useReducedMotion();
  const [content, setContent] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [showPendingNotice, setShowPendingNotice] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState(false);

  const contentCount = content.length;
  const trimmedContent = content.trim();
  const overLimit = contentCount > commentLimits.contentMax;
  const canSubmit = trimmedContent.length > 0 && !overLimit && !pending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsed = commentSchema.safeParse({
      content: trimmedContent,
      nickname: nickname.trim() || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "请输入评论内容。");
      return;
    }

    setPending(true);
    const result = await submitComment(postSlug, {
      content: parsed.data.content,
      nickname: parsed.data.nickname ?? undefined,
    });

    if (result.ok) {
      setContent("");
      setNickname("");
      setShowPendingNotice(true);
      toast.success("已提交，等待审核。");
    } else {
      setError(result.error);
    }

    setPending(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      transition={{ delay: reduced ? 0 : 0.05 }}
      className={cn(
        "rounded-[var(--radius-2xl)] border border-border/70 bg-background/60 p-4",
        "backdrop-blur-md",
        focused ? "ring-1 ring-border/60" : "ring-0"
      )}
    >
      <div className="space-y-3">
        <AnimatePresence>
          {error ? (
            <motion.div
              key="comment-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
            >
              <Alert variant="destructive">
                <AlertTitle>无法提交</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="昵称（可选）"
            className="h-9 max-w-[220px] text-sm"
            maxLength={commentLimits.nicknameMax}
            aria-label="Nickname"
          />
          {viewer?.userId ? (
            <span className="text-xs text-muted-foreground">已登录会员</span>
          ) : null}
          <span className="ml-auto text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/70">
            等待审核
          </span>
        </div>

        <Textarea
          id={textareaId}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="写下你对这篇文章的想法。"
          className={cn(
            "min-h-[140px] resize-y text-sm leading-relaxed",
            overLimit ? "border-destructive/70 focus-visible:ring-destructive/30" : ""
          )}
          aria-label="Write a note"
          disabled={pending}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-[0.65rem] uppercase tracking-[0.3em]",
                overLimit ? "text-destructive" : "text-muted-foreground/70"
              )}
            >
              {contentCount} / {commentLimits.contentMax}
            </span>
            {overLimit ? (
              <span className="text-xs text-destructive">超出字数限制。</span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/70">
              评论需审核后显示。
            </span>
            <Button type="submit" variant="secondary" disabled={!canSubmit}>
              {pending ? "提交中..." : "提交评论"}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showPendingNotice ? (
            <motion.div
              key="pending-notice"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
            >
              <PendingNoticeCard onDismiss={() => setShowPendingNotice(false)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
