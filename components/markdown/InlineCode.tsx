import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function InlineCode(props: ComponentProps<"code"> = {}) {
  const { className, ...rest } = props;
  const resolvedClassName = typeof className === "string" ? className : "";
  const dataAttrs = rest as { "data-language"?: unknown; "data-theme"?: unknown };
  const isBlock = Boolean(
    dataAttrs["data-language"] || dataAttrs["data-theme"] || (resolvedClassName && resolvedClassName.includes("language-"))
  );

  if (isBlock) {
    return <code {...rest} className={resolvedClassName} />;
  }

  return <code {...rest} className={cn("markdown-inline-code", resolvedClassName)} />;
}
