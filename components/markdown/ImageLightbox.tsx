"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ImageLightboxProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export function ImageLightbox(props: ImageLightboxProps = {}) {
  const { src, alt, className } = props;
  if (!src) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={cn("markdown-image-trigger", className)}>
          <img src={src} alt={alt ?? ""} loading="lazy" className="markdown-image" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl border border-border/70 bg-card/95 p-4">
        <img src={src} alt={alt ?? ""} className="max-h-[80vh] w-full rounded-(--radius) object-contain" />
      </DialogContent>
    </Dialog>
  );
}
