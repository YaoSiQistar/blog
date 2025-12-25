import * as React from "react";

import AnimatedLink from "@/components/motion/AnimatedLink";
import SheenHover from "@/components/motion/SheenHover";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "motion/react";
import { postCoverId, postMetaId, postTitleId } from "@/lib/motion/ids";
import { staggerItem } from "@/lib/motion/variants";
import { motionTokens } from "@/lib/motion/tokens";

export interface CatalogPost {
  title: React.ReactNode;
  slug: string;
  excerpt: React.ReactNode;
  category: string;
  date: string;
  readingTime: string;
  tags?: string[];
  cover?: string;
  supplemental?: React.ReactNode;
}

interface CatalogItemProps extends CatalogPost {
  isReduced?: boolean;
  index?: number;
  className?: string;
}

export function CatalogItem({
  title,
  slug,
  excerpt,
  category,
  date,
  readingTime,
  tags = [],
  cover,
  supplemental,
  isReduced = false,
  index = 0,
  className,
  ...props
}: CatalogItemProps & HTMLMotionProps<"article">) {
  const metaTransition = {
    delay: isReduced ? 0 : 0.12,
    duration: motionTokens.durations.fast,
    ease: motionTokens.easing.easeOut,
  };
  const lineTransition = {
    delay: isReduced ? 0 : 0.08,
    duration: motionTokens.durations.fast,
    ease: motionTokens.easing.easeOut,
  };

  return (
    <SheenHover className="block">
      <motion.article
        variants={staggerItem(isReduced)}
        initial="hidden"
        animate="visible"
        className={cn(
          "group relative grid gap-6 rounded-[var(--radius)] border border-border bg-card/70 px-6 py-6 transition-all hover:border-primary/70 hover:bg-card/90 lg:grid-cols-[1.1fr_0.9fr]",
          className
        )}
        {...props}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <span className="text-[0.7rem] font-semibold text-foreground/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{category}</span>
          </div>

          <motion.h3
            layoutId={postTitleId(slug)}
            className="text-2xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary"
          >
            <AnimatedLink
              href={`/posts/${slug}`}
              underlineThickness={1}
              underlineOffset={-2}
            >
              {title}
            </AnimatedLink>
          </motion.h3>

          {cover ? (
            <motion.div
              layoutId={postCoverId(slug)}
              className="h-24 w-full rounded-lg border border-border bg-cover bg-center"
              style={{ backgroundImage: `url(${cover})` }}
            />
          ) : null}

          <motion.p
            initial={isReduced ? false : { opacity: 0, y: 6 }}
            animate={isReduced ? false : { opacity: 1, y: 0 }}
            transition={metaTransition}
            className="text-sm text-muted-foreground"
          >
            {excerpt}
          </motion.p>
          {supplemental ? <div className="pt-2">{supplemental}</div> : null}
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end lg:text-right">
          <motion.div
            layoutId={postMetaId(slug)}
            initial={isReduced ? false : { opacity: 0, y: 6 }}
            animate={isReduced ? false : { opacity: 1, y: 0 }}
            transition={metaTransition}
            className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/80 transition-colors group-hover:text-foreground/80"
          >
            <div>{date}</div>
            <div className="mt-1">{readingTime}</div>
          </motion.div>
          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 6 }}
            animate={isReduced ? false : { opacity: 1, y: 0 }}
            transition={metaTransition}
            className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground/70 transition-colors group-hover:text-foreground/70"
          >
            {tags.length > 0 ? tags.join(" / ") : category}
          </motion.div>
          <motion.span
            initial={isReduced ? false : { scaleX: 0 }}
            animate={isReduced ? false : { scaleX: 1 }}
            transition={lineTransition}
            className="mt-2 h-px w-24 origin-left bg-border/70 transition-colors group-hover:bg-primary/60 lg:origin-right"
          />
        </div>
      </motion.article>
    </SheenHover>
  );
}
