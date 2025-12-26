"use client";

import { motion } from "motion/react";

import type { ApprovedComment } from "@/lib/comments/types";
import { staggerContainer } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import CommentItem from "./CommentItem";

type CommentListProps = {
  comments: ApprovedComment[];
};

export default function CommentList({ comments }: CommentListProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainer(reduced)}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {comments.map((comment, index) => (
        <CommentItem key={comment.id} comment={comment} animate={index < 6} />
      ))}
    </motion.div>
  );
}
