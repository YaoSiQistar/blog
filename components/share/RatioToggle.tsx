"use client";

import { Button } from "@/components/ui/button";
import type { PosterRatio } from "@/lib/poster/styles";
import { cn } from "@/lib/utils";

type RatioToggleProps = {
  ratio: PosterRatio;
  ratios: Record<PosterRatio, { label: string }>;
  onChange: (ratio: PosterRatio) => void;
};

export default function RatioToggle({ ratio, ratios, onChange }: RatioToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(ratios) as PosterRatio[]).map((key) => (
        <Button
          key={key}
          type="button"
          variant={ratio === key ? "default" : "outline"}
          size="sm"
          className={cn(ratio === key && "shadow-sm")}
          onClick={() => onChange(key)}
        >
          {ratios[key].label}
        </Button>
      ))}
    </div>
  );
}
