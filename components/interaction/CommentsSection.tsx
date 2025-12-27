"use client";

import * as React from "react";
import { motion } from "motion/react";

import type { ApprovedComment } from "@/lib/comments/types";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import AnimatedLink from "@/components/motion/AnimatedLink";
import CommentComposer from "./CommentComposer";
import CommentList from "./CommentList";
import CommentsEmptyState from "./CommentsEmptyState";

type CommentsSectionProps = {
  postSlug: string;
  initialComments: ApprovedComment[];
  approvedCount: number;
  viewer?: { userId?: string | null };
};

export default function CommentsSection({
  postSlug,
  initialComments,
  approvedCount,
  viewer,
}: CommentsSectionProps) {
  const reduced = useReducedMotion();
  const textareaId = React.useId();
  const displayCount = Number.isFinite(approvedCount) ? approvedCount : initialComments.length;

  const handleFocusComposer = () => {
    const element = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    element?.focus();
  };

  return (
    <section className="space-y-6 border-t border-border/60 pt-10">
      <motion.header
        variants={fadeUp(reduced)}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
              笔记 / 评论
            </p>
            <h3 className="text-lg font-semibold text-foreground">编辑部笔记</h3>
          </div>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/70">
            已通过 {displayCount}
          </span>
        </div>
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground/60">
          新评论需审核后发布。
        </p>
      </motion.header>

      <CommentComposer postSlug={postSlug} viewer={viewer} textareaId={textareaId} />

      {initialComments.length > 0 ? (
        <CommentList comments={initialComments} />
      ) : (
        <CommentsEmptyState onFocusComposer={handleFocusComposer} />
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>请友善，保持简短。</span>
        <AnimatedLink href="/login" className="text-xs">
          登录以收藏文章
        </AnimatedLink>
      </footer>
    </section>
  );
}
