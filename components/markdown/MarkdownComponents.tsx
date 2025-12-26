import type { ComponentType } from "react";

import { CodeBlock } from "./CodeBlock";
import { InlineCode } from "./InlineCode";
import { MarkdownLink } from "./MarkdownLink";
import { Callout } from "./Callout";
import { CodeTabs, CodeTab } from "./CodeTabs";
import { MermaidBlock } from "./MermaidBlock";
import { ChartBlock } from "./ChartBlock";
import { EmbedCard } from "./EmbedCard";
import { PostCardEmbed } from "./PostCardEmbed";
import { Gallery } from "./Gallery";
import { Steps, Step } from "./Steps";
import { MarkdownImage } from "./MarkdownImage";
import { MarkdownTable } from "./MarkdownTable";
import { Footnotes } from "./Footnotes";

export const markdownComponents = (() => {
  const components: Record<string, ComponentType<any>> = {};

  components.a = MarkdownLink;
  components.code = InlineCode;
  components.pre = CodeBlock;
  components.table = MarkdownTable;
  components.img = MarkdownImage;
  components.Callout = Callout;
  components.CodeTabs = CodeTabs;
  components.CodeTab = CodeTab;
  components.MermaidBlock = MermaidBlock;
  components.ChartBlock = ChartBlock;
  components.EmbedCard = EmbedCard;
  components.PostCardEmbed = PostCardEmbed;
  components.Gallery = Gallery;
  components.Steps = Steps;
  components.Step = Step;
  components.section = Footnotes;

  return components;
})();
