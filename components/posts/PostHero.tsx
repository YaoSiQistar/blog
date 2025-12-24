"use client";

import { motion } from "motion/react";

import { postCoverId, postMetaId, postTitleId } from "@/lib/motion/ids";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

interface PostHeroProps {
  title: string;
  slug: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  excerpt: string;
  cover?: string;
}

export default function PostHero({
  title,
  slug,
  date,
  readingTime,
  category,
  tags,
  excerpt,
  cover,
}: PostHeroProps) {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;

  return (
    <motion.div variants={fadeUp(reduced)} initial="hidden" animate="visible">
      <motion.h1
        layoutId={postTitleId(slug)}
        className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl"
      >
        {title}
      </motion.h1>
      <motion.div
        layoutId={postMetaId(slug)}
        className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span>{date}</span>
        <span>{readingTime}</span>
        <span>{category}</span>
        <span>{tags.join(", ")}</span>
      </motion.div>
      <p className="mt-6 text-base text-muted-foreground">{excerpt}</p>
      {cover ? (
        <motion.div
          layoutId={postCoverId(slug)}
          className="mt-6 h-56 w-full rounded-[var(--radius)] border border-border bg-cover bg-center"
          style={{ backgroundImage: `url(${cover})` }}
        />
      ) : null}
    </motion.div>
  );
}
