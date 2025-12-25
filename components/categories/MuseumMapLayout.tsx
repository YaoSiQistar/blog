"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { CategoryEdge, CategoryNode } from "@/lib/categories/mapModel";
import GalleryListPanel from "./GalleryListPanel";
import MuseumMap from "./MuseumMap";
import MapPlaque from "./MapPlaque";
import MapLegend from "./MapLegend";
import MobileMapSheet from "./MobileMapSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MuseumMapLayoutProps = {
  nodes: CategoryNode[];
  edges: CategoryEdge[];
  className?: string;
};

export default function MuseumMapLayout({ nodes, edges, className }: MuseumMapLayoutProps) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);
  const [activeSource, setActiveSource] = React.useState<"list" | "map" | null>(null);
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const selectedNode = React.useMemo(
    () => nodes.find((node) => node.slug === selectedSlug) ?? null,
    [nodes, selectedSlug]
  );

  const handleListHover = (slug: string | null) => {
    setActiveSource(slug ? "list" : null);
    setActiveSlug(slug);
  };

  const handleMapHover = (slug: string | null) => {
    setActiveSource(slug ? "map" : null);
    setActiveSlug(slug);
  };

  const handleMapSelect = (slug: string) => {
    setSelectedSlug((current) => {
      if (current === slug) {
        router.push(`/categories/${slug}`);
        return current;
      }
      return slug;
    });
    setSheetOpen(true);
  };

  const handleClear = () => {
    setActiveSlug(null);
    setActiveSource(null);
    setSelectedSlug(null);
    setSheetOpen(false);
  };

  React.useEffect(() => {
    if (!selectedSlug) {
      setSheetOpen(false);
    }
  }, [selectedSlug]);

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]", className)}>
      <div className="hidden lg:block">
        <GalleryListPanel
          items={nodes}
          activeSlug={activeSlug}
          selectedSlug={selectedSlug}
          scrollTargetSlug={activeSource === "map" ? activeSlug : null}
          onHover={handleListHover}
        />
      </div>

      <div className="space-y-4">
        <div className="lg:sticky lg:top-[6.75rem]">
          <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-card/70 shadow-soft">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_60%)]" />
            <div className="relative h-[420px] w-full lg:h-[520px]">
              <MuseumMap
                nodes={nodes}
                edges={edges}
                activeSlug={activeSlug}
                selectedSlug={selectedSlug}
                onHover={handleMapHover}
                onSelect={handleMapSelect}
                onClear={handleClear}
              />
            </div>

            <div className="absolute right-4 top-4 hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-[0.65rem] uppercase tracking-[0.35em]"
                onClick={handleClear}
              >
                Reset
              </Button>
            </div>

            {selectedNode ? (
              <div className="absolute left-4 top-4 hidden max-w-[240px] lg:block">
                <MapPlaque node={selectedNode} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:hidden">
          {selectedNode ? (
            <MapPlaque node={selectedNode} variant="compact" />
          ) : (
            <div className="rounded-[var(--radius)] border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
              Tap a gallery node to preview it.
            </div>
          )}
        </div>

        <MapLegend className="hidden lg:block" />
      </div>

      <div className="lg:hidden">
        <MobileMapSheet
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) setSelectedSlug(null);
          }}
          node={selectedNode}
        />
      </div>
    </div>
  );
}
