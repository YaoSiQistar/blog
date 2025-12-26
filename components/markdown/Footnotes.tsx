import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Footnotes(props?: ComponentProps<"section"> | null) {
  const safeProps = props ?? {};
  const { className, children, ...rest } = safeProps;
  const resolvedClassName = Array.isArray(className) ? className.join(" ") : className;
  const isFootnotes = resolvedClassName?.includes("footnotes");
  if (!isFootnotes) {
    return (
      <section {...rest} className={resolvedClassName}>
        {children}
      </section>
    );
  }

  return (
    <section {...rest} className={cn("markdown-footnotes", resolvedClassName)}>
      <h2 className="markdown-footnotes-title">Footnotes</h2>
      {children}
    </section>
  );
}
