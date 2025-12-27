import type { HTMLAttributes } from "react";
import { AlertTriangle, Flame, Info, Lightbulb, Sigma } from "lucide-react";

import { cn } from "@/lib/utils";

const icons = {
  note: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
  danger: Flame,
  theorem: Sigma,
};

type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof icons;
  title?: string;
};

export function Callout(props: CalloutProps = {}) {
  const { variant = "note", title, className, children, ...rest } = props;
  const Icon = icons[variant] ?? Info;
  const displayTitle =
    title ??
    ({
      note: "提示",
      tip: "技巧",
      warning: "注意",
      danger: "警告",
      theorem: "定理",
    }[variant] ?? variant.toUpperCase());

  return (
    <div
      {...rest}
      className={cn(
        "markdown-callout rounded-(--radius) border border-border/70 bg-card/70 p-5 shadow-[inset_0_0_0_1px_rgba(13,59,102,0.04)]",
        `markdown-callout-${variant}`,
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{displayTitle}</span>
      </div>
      <div className="mt-3 text-[0.98rem] leading-relaxed text-foreground">{children}</div>
    </div>
  );
}
