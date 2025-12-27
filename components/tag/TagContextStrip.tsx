"use client";
import Link from "next/link";
import { Copy, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeIn } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

type TagContextStripProps = {
  tagSlug: string;
  tagName: string;
  withTags: string[];
  q?: string;
  clearHref: string;
  currentHref: string;
  className?: string;
};

export default function TagContextStrip({
  tagSlug,
  tagName,
  withTags,
  q,
  clearHref,
  currentHref,
  className,
}: TagContextStripProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}${currentHref}`;
      await navigator.clipboard.writeText(url);
      toast.success("标签专题链接已复制。");
    } catch (error) {
      console.error(error);
      toast.error("无法复制链接。");
    }
  };

  return (
    <motion.section
      variants={fadeIn(reduced)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-card/60 px-4 py-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-full border border-primary/40 bg-primary/10 text-[0.6rem] uppercase tracking-[0.35em]">
          {tagName}
        </Badge>
        {withTags.length > 0 ? (
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70">
            同时包含
          </span>
        ) : null}
        {withTags.map((tag) => (
          <Badge
            key={`${tagSlug}-${tag}`}
            variant="secondary"
            className="rounded-full border-border-subtle bg-card/80 text-[0.6rem] uppercase tracking-[0.35em]"
          >
            {tag}
          </Badge>
        ))}
        {q ? (
          <Badge
            variant="outline"
            className="rounded-full border-border-subtle text-[0.6rem] uppercase tracking-[0.35em]"
          >
            搜索：{q}
          </Badge>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {(withTags.length > 0 || q) && (
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={clearHref} aria-label="Clear tag filters">
              <X className="size-3" />
              清除
            </Link>
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
          <Copy className="size-3.5" />
          复制链接
        </Button>
      </div>
    </motion.section>
  );
}
