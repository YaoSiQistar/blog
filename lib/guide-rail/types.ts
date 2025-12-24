export type GuideNodeKind = "section" | "heading" | "page" | "module";

export type GuideNodeTarget = {
  type: "scroll" | "route";
  selector?: string;
  href?: string;
};

export type GuideNodeMeta = {
  count?: number;
  subtitle?: string;
  visited?: boolean;
  disabled?: boolean;
};

export type GuideNode = {
  id: string;
  label: string;
  kind: GuideNodeKind;
  level?: 1 | 2;
  target: GuideNodeTarget;
  meta?: GuideNodeMeta;
};

export type GuideRailMode = "index" | "reading" | "hero";

export type GuideRailState = {
  activeId?: string;
  progress: number;
  mode: GuideRailMode;
};

export type GuideNodePosition = {
  id: string;
  y: number;
};

export type GuideMapMode = "dom" | "even";
