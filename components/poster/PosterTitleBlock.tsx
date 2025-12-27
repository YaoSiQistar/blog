import { motion } from "motion/react";
import { postTitleId } from "@/lib/motion/ids";
import { cn } from "@/lib/utils";

type PosterTitleBlockProps = {
  slug: string;
  title: string;
  excerpt?: string;
  className?: string;
};

export default function PosterTitleBlock({
  slug,
  title,
  excerpt,
  className,
}: PosterTitleBlockProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <motion.h1
        layoutId={postTitleId(slug)}
        className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
      >
        {title}
      </motion.h1>
      {excerpt ? (
        <p
          className="max-w-[52ch] text-base text-muted-foreground"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {excerpt}
        </p>
      ) : null}
    </div>
  );
}
