import type { MarkdownFeatureOverrides, MarkdownPresetName } from "./features";
import type { PostIndexItem } from "../content/types";

export type ReferenceEntry = {
  id: string;
  title: string;
  author?: string;
  year?: string;
  source?: string;
  url?: string;
  publisher?: string;
  note?: string;
};

export type MarkdownRenderOptions = {
  features?: MarkdownPresetName | MarkdownFeatureOverrides;
  references?: ReferenceEntry[];
  postIndex?: PostIndexItem[];
  paragraphAnchors?: boolean;
};
