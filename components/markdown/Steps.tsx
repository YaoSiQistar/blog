import type { HTMLAttributes, LiHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StepsProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

type StepProps = LiHTMLAttributes<HTMLLIElement> & {
  title?: string;
};

export function Steps(props: StepsProps = {}) {
  const { title, className, children, ...rest } = props;
  return (
    <div {...rest} className={cn("markdown-steps", className)}>
      {title ? (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          {title}
        </div>
      ) : null}
      <ol className="markdown-steps-list">{children}</ol>
    </div>
  );
}

export function Step(props: StepProps = {}) {
  const { title, className, children, ...rest } = props;
  return (
    <li {...rest} className={cn("markdown-step", className)}>
      {title ? <div className="markdown-step-title">{title}</div> : null}
      <div className="markdown-step-body">{children}</div>
    </li>
  );
}
