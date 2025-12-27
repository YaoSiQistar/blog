import { motion } from "motion/react";
import { postMetaId } from "@/lib/motion/ids";
import { cn } from "@/lib/utils";

type PosterMetaRowProps = {
  slug: string;
  date: string;
  readingTime?: string;
  category?: string;
  className?: string;
};

export default function PosterMetaRow({
  slug,
  date,
  readingTime,
  category,
  className,
}: PosterMetaRowProps) {
  const items = [date, readingTime, category].filter(Boolean) as string[];
  if (!items.length) return null;

  return (
    <motion.div
      layoutId={postMetaId(slug)}
      className={cn(
        "flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/80",
        className
      )}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </motion.div>
  );
}
