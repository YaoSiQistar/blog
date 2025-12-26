"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ReadingPositionProps = {
  targetId?: string;
  className?: string;
};

export function ReadingPosition(props?: ReadingPositionProps | null) {
  const safeProps = props ?? {};
  const { targetId = "article", className } = safeProps;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const container = document.getElementById(targetId);
    if (!container) return;
    const candidates = Array.from(
      container.querySelectorAll<HTMLElement>(
        "[data-anchor-target], h2[id], h3[id], h4[id]"
      )
    );

    if (!candidates.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        const id = visible[0].target.id;
        if (id) setActiveId(id);
      },
      {
        rootMargin: "-35% 0px -60% 0px",
        threshold: 0,
      }
    );

    candidates.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [targetId]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      const url = new URL(window.location.href);
      if (activeId) url.hash = `#${activeId}`;
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "rounded-full border border-border/70 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground transition hover:border-foreground hover:text-foreground",
        className
      )}
    >
      {copied ? "Copied" : "Copy section link"}
    </button>
  );
}
