import * as React from "react";

import Kicker from "@/components/editorial/Kicker";
import { cn } from "@/lib/utils";

interface PageHeaderProps
  extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  meta?: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  label,
  meta,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-3", className)} {...props}>
      {label && <Kicker label={label} />}
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="max-w-[90ch] text-4xl font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {meta && (
          <span className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
            {meta}
          </span>
        )}
      </div>
      <p className="max-w-[70ch] text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </header>
  );
}
