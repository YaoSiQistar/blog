export type PosterStyleId =
  | "paper-editorial"
  | "museum-plaque"
  | "type-grid"
  | "mono-ink";

export type PosterStyleGroup = "Editorial" | "Gallery" | "Minimal" | "Bold";

export type PosterRatio = "landscape";

export const posterRatios: Record<
  PosterRatio,
  { label: string; width: number; height: number; aspect: string }
> = {
  landscape: {
    label: "横版 1200x630",
    width: 1200,
    height: 630,
    aspect: "1200 / 630",
  },
};

export const posterStyles: Array<{
  id: PosterStyleId;
  name: string;
  group: PosterStyleGroup;
  description: string;
}> = [
  {
    id: "paper-editorial",
    name: "暖纸张编辑部",
    group: "Editorial",
    description: "暖纸张编辑部主海报。",
  },
  {
    id: "museum-plaque",
    name: "博物馆展签",
    group: "Editorial",
    description: "展签式审稿牌布局。",
  },
  {
    id: "type-grid",
    name: "排版网格",
    group: "Bold",
    description: "栅格实验排版。",
  },
  {
    id: "mono-ink",
    name: "单色墨印",
    group: "Minimal",
    description: "单色墨印极简。",
  },
];

export const posterDefaultStyle: PosterStyleId = "paper-editorial";
export const posterDefaultRatio: PosterRatio = "landscape";
