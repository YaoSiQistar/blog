"use client";

import { Button } from "@/components/ui/button";
import type { PosterRatio } from "@/lib/poster/styles";

import RatioToggle from "./RatioToggle";

type PosterActionsProps = {
  ratio: PosterRatio;
  ratios: Record<PosterRatio, { label: string }>;
  onRatioChange: (ratio: PosterRatio) => void;
  onDownload: () => void;
  onCopyLink: () => void;
  onCopyImage: () => void;
  downloading: boolean;
  copyingImage: boolean;
};

export default function PosterActions({
  ratio,
  ratios,
  onRatioChange,
  onDownload,
  onCopyLink,
  onCopyImage,
  downloading,
  copyingImage,
}: PosterActionsProps) {
  return (
    <section className="space-y-4 rounded-[var(--radius)] border border-border bg-card/50 p-4">
      <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        操作区
      </div>
      {Object.keys(ratios).length > 1 ? (
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">尺寸比例</div>
          <RatioToggle ratio={ratio} ratios={ratios} onChange={onRatioChange} />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onDownload} disabled={downloading}>
          {downloading ? "正在生成..." : "下载 PNG"}
        </Button>
        <Button type="button" variant="outline" onClick={onCopyLink}>
          复制分享链接
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCopyImage}
          disabled={copyingImage}
        >
          {copyingImage ? "复制中..." : "复制图片"}
        </Button>
      </div>
    </section>
  );
}
