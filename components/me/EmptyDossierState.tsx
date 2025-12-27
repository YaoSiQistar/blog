"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DossierTab } from "@/lib/me/query";

const copy = {
  favorites: {
    title: "暂无收藏。",
    cta: "浏览文章",
    href: "/posts",
  },
  likes: {
    title: "暂无点赞。",
    cta: "去探索",
    href: "/posts",
  },
  comments: {
    title: "暂无评论。",
    cta: "加入讨论",
    href: "/posts",
  },
} as const;

type EmptyDossierStateProps = {
  tab: DossierTab;
  className?: string;
};

export default function EmptyDossierState({ tab, className }: EmptyDossierStateProps) {
  const content = copy[tab];
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">{content.title}</p>
      <div className="mt-4 flex justify-center">
        <Button asChild variant="secondary">
          <Link href={content.href}>{content.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
