"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  buildDossierHref,
  normalizeDossierState,
  parseDossierParams,
  resetPageOnChange,
  type DossierTab,
} from "@/lib/me/query";

const tabs: Array<{ value: DossierTab; label: string }> = [
  { value: "favorites", label: "收藏" },
  { value: "likes", label: "点赞" },
  { value: "comments", label: "评论" },
];

export default function DossierTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const current = React.useMemo(() => parseDossierParams(searchParams), [searchParams]);

  const updateTab = (nextTab: DossierTab) => {
    const nextState = normalizeDossierState({ ...current, tab: nextTab });
    const resolved = resetPageOnChange(current, nextState);
    router.push(buildDossierHref(resolved));
  };

  return (
    <div className="space-y-3">
      <div className="hidden items-end gap-4 border-b border-border/70 lg:flex">
        {tabs.map((tab) => {
          const active = current.tab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateTab(tab.value)}
              className={cn(
                "relative pb-3 text-xs uppercase tracking-[0.35em] text-muted-foreground transition",
                active && "text-foreground"
              )}
            >
              <span className="relative z-10">{tab.label}</span>
              {active ? (
                <motion.span
                  layoutId="dossier-tab-underline"
                  className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: motionTokens.durations.fast, ease: motionTokens.easing.easeOut }
                  }
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="lg:hidden">
        <ToggleGroup
          type="single"
          value={current.tab}
          onValueChange={(value) => {
            if (!value) return;
            updateTab(value as DossierTab);
          }}
          className="w-full rounded-full border border-border/70 bg-card/70 p-1"
        >
          {tabs.map((tab) => (
            <ToggleGroupItem
              key={tab.value}
              value={tab.value}
              className="flex-1 text-xs uppercase tracking-[0.3em]"
            >
              {tab.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
