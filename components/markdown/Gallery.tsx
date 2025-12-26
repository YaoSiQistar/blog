import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GalleryProps = HTMLAttributes<HTMLDivElement> & {
  columns?: number | string;
};

export function Gallery(props: GalleryProps = {}) {
  const { columns, className, children, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn("markdown-gallery", className)}
      data-columns={columns ?? undefined}
    >
      {children}
    </div>
  );
}
