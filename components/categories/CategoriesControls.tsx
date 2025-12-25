"use client";

import { LayoutGrid, List, Map as MapIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

type ViewMode = "grid" | "list" | "map";

type CategoriesControlsProps = {
  total: number;
  className?: string;
};

const normalizeView = (value: string | null): ViewMode => {
  if (value === "list" || value === "map" || value === "grid") return value;
  return "grid";
};

export default function CategoriesControls({ total, className }: CategoriesControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const currentView = normalizeView(searchParams.get("view"));

  const handleViewChange = (value: string) => {
    if (!value) return;
    const nextView = normalizeView(value);
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === "grid") {
      params.delete("view");
    } else {
      params.set("view", nextView);
    }
    const qs = params.toString();
    router.push(qs ? `/categories?${qs}` : "/categories");
  };

  return (
    <motion.div
      variants={fadeUp(reduced)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-card/70 px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-[0.65rem]">
          Museum Guide
        </span>
        <span>{total} galleries</span>
      </div>

      <ToggleGroup
        type="single"
        value={currentView}
        onValueChange={handleViewChange}
        className="rounded-full border border-border-subtle bg-background/70 p-1"
      >
        <ToggleGroupItem
          value="grid"
          className="flex items-center gap-2 px-3 text-xs uppercase tracking-[0.3em]"
          aria-label="Grid view"
        >
          <LayoutGrid className="size-3.5" />
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list"
          className="flex items-center gap-2 px-3 text-xs uppercase tracking-[0.3em]"
          aria-label="List view"
        >
          <List className="size-3.5" />
          List
        </ToggleGroupItem>
        <ToggleGroupItem
          value="map"
          className="flex items-center gap-2 px-3 text-xs uppercase tracking-[0.3em]"
          aria-label="Map view"
        >
          <MapIcon className="size-3.5" />
          Map
        </ToggleGroupItem>
      </ToggleGroup>
    </motion.div>
  );
}
