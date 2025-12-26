"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import type { MarkdownFeatures, MarkdownPresetName } from "@/lib/markdown/features";

const toParams = (searchParams: URLSearchParams) => new URLSearchParams(searchParams.toString());

type ToggleItem = {
  label: string;
  key: string;
  value: boolean;
};

type MarkdownLabControlsProps = {
  preset: MarkdownPresetName;
  features: MarkdownFeatures;
};

export function MarkdownLabControls({ preset, features }: MarkdownLabControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggles = useMemo<ToggleItem[]>(
    () => [
      { label: "TOC", key: "toc", value: features.toc },
      { label: "Code highlight", key: "codeHighlight", value: features.code.highlight },
      { label: "Line numbers", key: "codeLineNumbers", value: features.code.lineNumbers },
      { label: "Line highlight", key: "codeLineHighlight", value: features.code.lineHighlight },
      { label: "Code titles", key: "codeTitles", value: features.code.titles },
      { label: "Code tabs", key: "codeTabs", value: features.code.tabs },
      { label: "Diff", key: "codeDiff", value: features.code.diff },
      { label: "Callouts", key: "callouts", value: features.callouts },
      { label: "Math", key: "math", value: features.math },
      { label: "Mermaid", key: "mermaid", value: features.mermaid },
      { label: "Charts", key: "charts", value: features.charts },
      { label: "Citations", key: "citations", value: features.citations },
      { label: "Wiki links", key: "wikilinks", value: features.wikilinks },
      { label: "Embeds", key: "embeds", value: features.embeds },
      { label: "Tables", key: "tables", value: features.tables },
      { label: "CSV tables", key: "csvTables", value: features.csvTables },
      { label: "Lightbox", key: "imageLightbox", value: features.images.lightbox },
      { label: "Gallery", key: "imageGallery", value: features.images.gallery },
      { label: "Captions", key: "imageCaptions", value: features.images.captions },
      { label: "Steps", key: "steps", value: features.steps },
      { label: "Progress", key: "readingProgress", value: features.reading.progress },
      { label: "Focus mode", key: "focusMode", value: features.reading.focusMode },
      { label: "Print CSS", key: "printCSS", value: features.reading.printCSS },
    ],
    [features]
  );

  const updateParam = (key: string, value: boolean) => {
    const params = toParams(searchParams);
    params.set(key, value ? "1" : "0");
    router.push(`?${params.toString()}`);
  };

  const updatePreset = (value: MarkdownPresetName) => {
    const params = toParams(searchParams);
    params.set("preset", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="markdown-lab-controls rounded-[var(--radius)] border border-border/70 bg-card/70 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Preset</label>
        <select
          value={preset}
          onChange={(event) => updatePreset(event.target.value as MarkdownPresetName)}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.3em]"
        >
          <option value="minimal">Minimal</option>
          <option value="blog">Blog</option>
          <option value="ultra">Ultra</option>
        </select>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {toggles.map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-3 text-xs">
            <span className="uppercase tracking-[0.25em] text-muted-foreground">{item.label}</span>
            <Switch checked={item.value} onCheckedChange={(value) => updateParam(item.key, value)} />
          </label>
        ))}
      </div>
    </div>
  );
}
