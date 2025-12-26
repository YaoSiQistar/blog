"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";

import { cn } from "@/lib/utils";

type HeadingAnchorProps = {
  href?: string;
  variant?: "heading" | "paragraph";
  className?: string;
};

export function HeadingAnchor(props?: HeadingAnchorProps | null) {
  const safeProps = props ?? {};
  const { href, variant = "heading", className } = safeProps;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!href) return;
    try {
      const url = new URL(window.location.href);
      url.hash = href.startsWith("#") ? href : `#${href}`;
      await navigator.clipboard.writeText(url.toString());
      window.history.replaceState(null, "", url.toString());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "markdown-anchor inline-flex items-center justify-center rounded-full border border-border/60 text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground",
        variant === "heading" ? "h-6 w-6" : "h-5 w-5",
        className
      )}
      aria-label={copied ? "Copied" : "Copy link"}
    >
      {copied ? "OK" : <Link2 className="h-3 w-3" />}
    </a>
  );
}
