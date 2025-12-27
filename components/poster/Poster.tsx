"use client";

import type React from "react";
import { motion } from "motion/react";

import type { PostIndexItem } from "@/lib/content/types";
import { posterTokens, type PosterTemplate } from "@/lib/poster/tokens";
import { posterConfig, resolveIssue, resolvePosterTemplate } from "@/lib/poster/config";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

import PosterFrame from "./PosterFrame";
import PosterHeader from "./PosterHeader";
import PosterTitleBlock from "./PosterTitleBlock";
import PosterMetaRow from "./PosterMetaRow";
import PosterTags from "./PosterTags";
import PosterCover from "./PosterCover";

type PosterProps = {
  post: PostIndexItem;
  template?: PosterTemplate;
  className?: string;
};

export default function Poster({ post, template, className }: PosterProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  const resolvedTemplate = (() => {
    const candidate = template ?? resolvePosterTemplate(post);
    if (!post.cover && candidate !== "plain") return "plain";
    return candidate;
  })();

  const showCover = Boolean(post.cover) && resolvedTemplate === "a";
  const useCoverWash = Boolean(post.cover) && resolvedTemplate === "b";
  const issue = resolveIssue(post);

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={reduced ? false : { opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: motionTokens.durations.normal, ease: motionTokens.easing.easeOut }
      }
      className={cn("mx-auto w-full", className)}
      style={{
        maxWidth: posterTokens.sizes.posterMaxWidth,
        "--poster-paper": posterTokens.colors.paper,
        "--poster-ink": posterTokens.colors.ink,
        "--poster-hairline": posterTokens.colors.hairline,
        "--poster-accent": posterTokens.colors.accent,
      } as React.CSSProperties}
    >
      <PosterFrame
        withWash={useCoverWash}
        coverUrl={post.cover}
        className="px-8 py-8"
      >
        <div className="space-y-6">
          <PosterHeader date={post.date} issue={issue} series={post.series} />
          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            animate={reduced ? false : { scaleX: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: motionTokens.durations.fast, ease: motionTokens.easing.easeOut }
            }
            className="h-px w-full origin-left bg-border/70"
          />

          {showCover ? (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-5">
                <PosterTitleBlock slug={post.slug} title={post.title} excerpt={post.excerpt} />
                <PosterMetaRow
                  slug={post.slug}
                  date={post.date}
                  readingTime={post.readingTime}
                  category={post.category}
                />
                <PosterTags tags={post.tags} />
              </div>
              <PosterCover slug={post.slug} cover={post.cover ?? ""} reduced={reduced} />
            </div>
          ) : (
            <div className="space-y-5">
              <PosterTitleBlock slug={post.slug} title={post.title} excerpt={post.excerpt} />
              <PosterMetaRow
                slug={post.slug}
                date={post.date}
                readingTime={post.readingTime}
                category={post.category}
              />
              <PosterTags tags={post.tags} />
            </div>
          )}

          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            animate={reduced ? false : { scaleX: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: motionTokens.durations.fast, ease: motionTokens.easing.easeOut }
            }
            className="h-px w-full origin-left bg-border/70"
          />
          <div className="flex flex-wrap items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
            <span>封面海报</span>
            <span>{posterConfig.issue.label} {issue ?? "-"}</span>
          </div>
        </div>
      </PosterFrame>
    </motion.section>
  );
}







