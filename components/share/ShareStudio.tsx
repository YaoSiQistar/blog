"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";

import type { PosterData } from "@/lib/poster/posterData";
import {
  posterDefaultRatio,
  posterDefaultStyle,
  posterRatios,
  posterStyles,
  type PosterRatio,
  type PosterStyleId,
} from "@/lib/poster/styles";
import { useReducedMotion } from "@/lib/motion/reduced";
import { cn } from "@/lib/utils";

import PosterPreview from "./PosterPreview";
import StyleGallery from "./StyleGallery";
import PosterActions from "./PosterActions";

type ShareStudioProps = {
  post: PosterData;
  initialStyle?: PosterStyleId;
  initialRatio?: PosterRatio;
};

const buildShareUrl = (origin: string, pathname: string, style: PosterStyleId, ratio: PosterRatio) =>
  `${origin}${pathname}?style=${style}&ratio=${ratio}`;

export default function ShareStudio({
  post,
  initialStyle = posterDefaultStyle,
  initialRatio = posterDefaultRatio,
}: ShareStudioProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const [styleId, setStyleId] = useState<PosterStyleId>(initialStyle);
  const [ratio, setRatio] = useState<PosterRatio>(initialRatio);
  const [downloading, setDownloading] = useState(false);
  const [copyingImage, setCopyingImage] = useState(false);

  useEffect(() => {
    router.replace(`${pathname}?style=${styleId}&ratio=${ratio}`, { scroll: false });
  }, [pathname, ratio, router, styleId]);

  const posterSrc = useMemo(
    () => `/api/poster/posts/${post.slug}?style=${styleId}&ratio=${ratio}`,
    [post.slug, ratio, styleId]
  );

  const preloadPoster = (nextStyle: PosterStyleId) => {
    if (typeof window === "undefined") return;
    const image = new Image();
    image.src = `/api/poster/posts/${post.slug}?style=${nextStyle}&ratio=${ratio}&size=thumb`;
  };

  const onCopyLink = async () => {
    try {
      const origin = window.location.origin;
      const url = buildShareUrl(origin, pathname, styleId, ratio);
      await navigator.clipboard.writeText(url);
      toast.success("分享链接已复制。");
    } catch {
      toast.error("无法复制链接。");
    }
  };

  const onDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(posterSrc);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${post.slug}-${styleId}-${ratio}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("下载失败，请稍后重试。");
    } finally {
      setDownloading(false);
    }
  };

  const onCopyImage = async () => {
    try {
      if (!("ClipboardItem" in window)) {
        toast.error("当前浏览器不支持复制图片。");
        return;
      }
      setCopyingImage(true);
      const res = await fetch(posterSrc);
      const blob = await res.blob();
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      toast.success("海报图片已复制。");
    } catch {
      toast.error("复制图片失败。");
    } finally {
      setCopyingImage(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <motion.section
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={reducedMotion ? false : { opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "rounded-[var(--radius)] border border-border bg-card/50 p-5 shadow-[0_20px_70px_-50px_rgba(15,23,42,0.55)]"
        )}
      >
        <PosterPreview src={posterSrc} ratio={ratio} title={post.title} />
      </motion.section>

      <div className="space-y-6">
        <StyleGallery
          styles={posterStyles}
          activeStyle={styleId}
          onChange={setStyleId}
          onHover={preloadPoster}
          slug={post.slug}
          ratio={ratio}
        />

        <PosterActions
          ratio={ratio}
          ratios={posterRatios}
          onRatioChange={setRatio}
          onCopyLink={onCopyLink}
          onDownload={onDownload}
          onCopyImage={onCopyImage}
          downloading={downloading}
          copyingImage={copyingImage}
        />
      </div>
    </div>
  );
}
