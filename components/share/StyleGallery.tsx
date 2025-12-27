"use client";

import { useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PosterRatio, PosterStyleGroup, PosterStyleId } from "@/lib/poster/styles";
import { cn } from "@/lib/utils";

import StyleCard from "./StyleCard";

type StyleGalleryProps = {
  styles: Array<{
    id: PosterStyleId;
    name: string;
    group: PosterStyleGroup;
    description: string;
  }>;
  activeStyle: PosterStyleId;
  ratio: PosterRatio;
  slug: string;
  onChange: (style: PosterStyleId) => void;
  onHover: (style: PosterStyleId) => void;
};

const groupLabels: Record<PosterStyleGroup, string> = {
  Editorial: "编辑部",
  Gallery: "画册",
  Minimal: "极简",
  Bold: "强调",
};

export default function StyleGallery({
  styles,
  activeStyle,
  ratio,
  slug,
  onChange,
  onHover,
}: StyleGalleryProps) {
  const [group, setGroup] = useState<PosterStyleGroup | "All">("All");
  const groups = useMemo(() => ["All", ...Object.keys(groupLabels)] as const, []);

  const filtered = useMemo(() => {
    if (group === "All") return styles;
    return styles.filter((style) => style.group === group);
  }, [group, styles]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          样式画廊
        </div>
      </div>

      <Tabs value={group} onValueChange={(value) => setGroup(value as typeof group)}>
        <TabsList className="bg-background/60">
          {groups.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item === "All" ? "All" : groupLabels[item as PosterStyleGroup]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2",
          "lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible"
        )}
      >
        {filtered.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            active={style.id === activeStyle}
            slug={slug}
            ratio={ratio}
            onSelect={() => onChange(style.id)}
            onHover={() => onHover(style.id)}
          />
        ))}
      </div>
    </section>
  );
}
