"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import type { PosterRatio } from "@/lib/poster/styles";
import { posterRatios } from "@/lib/poster/styles";
import { useReducedMotion } from "@/lib/motion/reduced";
import { cn } from "@/lib/utils";

type PosterPreviewProps = {
  src: string;
  ratio: PosterRatio;
  title: string;
};

export default function PosterPreview({ src, ratio, title }: PosterPreviewProps) {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const aspect = posterRatios[ratio].aspect;

  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        预览舞台
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius)] border border-border",
          "shadow-[0_30px_80px_-60px_rgba(15,23,42,0.6)]"
        )}
        style={{ aspectRatio: aspect, backgroundColor: "#FAFAF9" }}
      >
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-card/80 via-background to-card/60" />
        ) : null}
        <motion.img
          key={src}
          src={src}
          alt={`${title} 海报预览`}
          className="absolute inset-0 h-full w-full object-cover"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={reducedMotion ? false : { opacity: loading ? 0 : 1 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
        />
      </div>
    </div>
  );
}
