import * as React from "react";

import { cn } from "@/lib/utils";

interface KickerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  label: string;
  caption?: string;
}

export default function Kicker({
  label,
  caption,
  className,
  ...props
}: KickerProps) {
  return (
    <p
      className={cn(
        "flex items-center text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-muted-foreground",
        className
      )}
      {...props}
    >
      {caption && (
        <span className="mr-3 text-[0.55rem] tracking-[0.75em] text-muted-foreground/70">
          {caption}
        </span>
      )}
      {label}
    </p>
  );
}
