"use client";

import { useEffect, useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton(props?: CopyButtonProps | null) {
  const safeProps = props ?? { value: "" };
  const { value = "", label = "复制", className } = safeProps;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-full border border-border/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-muted-foreground transition hover:border-foreground hover:text-foreground ${className ?? ""}`}
    >
      {copied ? "已复制" : label}
    </button>
  );
}
