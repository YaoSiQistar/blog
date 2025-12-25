export type KintsugNodeKind = "section" | "heading" | "page" | "module";

export type KintsugNodeTarget = {
  type: "scroll" | "route";
  selector?: string;
  href?: string;
};

export type KintsugNodeMeta = {
  count?: number;
  subtitle?: string;
  visited?: boolean;
  disabled?: boolean;
};

export type KintsugNode = {
  id: string;
  label: string;
  kind: KintsugNodeKind;
  level?: 1 | 2;
  target: KintsugNodeTarget;
  meta?: KintsugNodeMeta;
};

export type KintsugRailMode = "index" | "reading" | "hero";

export type KintsugRailState = {
  activeId?: string;
  progress: number;
  mode: KintsugRailMode;
};

export type KintsugNodePosition = {
  id: string;
  y: number;
};

export type KintsugMapMode = "dom" | "even";
