import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function MarkdownTable(props: ComponentProps<"table"> = {}) {
  const { className, ...rest } = props;
  return (
    <div className="markdown-table-wrapper">
      <table {...rest} className={cn("markdown-table", className)} />
    </div>
  );
}
