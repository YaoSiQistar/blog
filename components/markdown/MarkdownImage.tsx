"use client";

import type { ComponentProps } from "react";

import { useMarkdownContext } from "./MarkdownContext";
import { ImageLightbox } from "./ImageLightbox";
import { cn } from "@/lib/utils";

export function MarkdownImage(props: ComponentProps<"img"> = {}) {
  const { className, ...rest } = props;
  const context = useMarkdownContext();
  const allowLightbox = context?.features.images.lightbox ?? false;

  if (allowLightbox) {
    const src = typeof rest.src === "string" ? rest.src : undefined;
    const alt = typeof rest.alt === "string" ? rest.alt : undefined;
    return <ImageLightbox src={src} alt={alt} className={className} />;
  }

  return (
    <img
      {...rest}
      className={cn("markdown-image", className)}
      loading={rest.loading ?? "lazy"}
    />
  );
}
