import * as React from "react";

import { cn } from "@/lib/utils";

type RuleLineProps = React.HTMLAttributes<HTMLSpanElement>;

export function RuleLine({ className, style, ...props }: RuleLineProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px w-full", className)}
      style={{ backgroundColor: "var(--border-subtle)", ...style }}
      {...props}
    />
  );
}
