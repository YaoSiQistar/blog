"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type MermaidBlockProps = {
  code: string;
  className?: string;
};

export function MermaidBlock(props?: MermaidBlockProps | null) {
  const safeProps = props ?? { code: "" };
  const { code = "", className } = safeProps;
  const id = useId().replace(/[:]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "strict" });
        const { svg } = await mermaid.render(`mermaid-${id}`, code);
        if (!active) return;
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Mermaid render failed");
      }
    };

    render();
    return () => {
      active = false;
    };
  }, [code, id]);

  return (
    <div className={cn("markdown-mermaid", className)} data-mermaid>
      {error ? (
        <pre className="markdown-mermaid-error">{error}</pre>
      ) : (
        <div ref={containerRef} className="markdown-mermaid-inner">
          <pre className="markdown-mermaid-fallback">{code}</pre>
        </div>
      )}
    </div>
  );
}
