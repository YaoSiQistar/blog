"use client";

import { useEffect, useState } from "react";

type ReadingProgressProps = {
  targetId?: string;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function ReadingProgress({ targetId = "article" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setProgress(0);
        return;
      }
      const rect = target.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const docHeight = target.scrollHeight + rect.top;
      const viewport = window.innerHeight;
      const relative = clamp((scrollTop - rect.top + viewport / 2) / (docHeight - viewport));
      setProgress(relative);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div className="sticky top-22 z-30 overflow-hidden bg-background/70 px-6 py-2 backdrop-blur-sm">
      <div className="h-1 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary to-accent"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
