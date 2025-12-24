import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerVariant = "wide" | "prose";

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
}

export default function Container({
  variant = "wide",
  className,
  ...props
}: ContainerProps) {
  const widthClass =
    variant === "prose"
      ? "max-w-[var(--container-prose)]"
      : "max-w-[var(--container-wide)]";

  return (
    <div
      data-container={variant}
      className={cn(
        "mx-auto w-full px-[var(--gutter)]",
        widthClass,
        className
      )}
      {...props}
    />
  );
}
