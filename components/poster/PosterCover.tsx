import { motion } from "motion/react";
import { posterTokens } from "@/lib/poster/tokens";
import { postCoverId } from "@/lib/motion/ids";
import { cn } from "@/lib/utils";

const frameStyles = "rounded-[var(--radius)] border border-border bg-card/70 p-2";

type PosterCoverProps = {
  slug: string;
  cover: string;
  caption?: string;
  reduced?: boolean;
  className?: string;
};

export default function PosterCover({
  slug,
  cover,
  caption,
  reduced = false,
  className,
}: PosterCoverProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <motion.div
        className={frameStyles}
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={reduced ? false : { clipPath: "inset(0 0 0% 0)" }}
        transition={reduced ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          layoutId={postCoverId(slug)}
          src={cover}
          alt=""
          loading="lazy"
          className="w-full rounded-[calc(var(--radius)-2px)] border border-border/70"
          style={{ aspectRatio: posterTokens.sizes.posterAspect, objectFit: "cover" }}
        />
      </motion.div>
      {caption ? (
        <div className="text-[0.6rem] uppercase tracking-[0.32em] text-muted-foreground/70">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

