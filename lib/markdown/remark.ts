import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { toString } from "hast-util-to-string";
import type { ShikiTransformer } from "shiki";
import { transformerMetaHighlight, transformerNotationDiff } from "@shikijs/transformers";
import { rehypeNormalizeProperties } from "./plugins/rehype-normalize";

export const remarkPlugins = [remarkGfm];

const lineNumbersTransformer = (): ShikiTransformer => ({
  name: "line-numbers",
  code(hast) {
    if (!hast || hast.type !== "element" || !this.options.meta?.["data-line-numbers"]) return;
    hast.properties = hast.properties ?? {};
    hast.properties["data-line-numbers"] = "true";
  },
  line(hast, lineNumber) {
    if (!hast || hast.type !== "element" || !this.options.meta?.["data-line-numbers"]) return;
    hast.properties = hast.properties ?? {};
    hast.properties["data-line"] = lineNumber;
  },
});

const diffPrefixTransformer = (): ShikiTransformer => ({
  name: "diff-prefix",
  line(hast) {
    if (!hast || hast.type !== "element" || this.options.lang !== "diff") return;
    const text = toString(hast).trim();
    if (!text) return;
    if (text.startsWith("+")) {
      this.addClassToHast(hast, "diff-added");
    } else if (text.startsWith("-")) {
      this.addClassToHast(hast, "diff-removed");
    }
  },
});

const parseMetaString = (metaString: string) => {
  const raw = metaString.trim();
  if (!raw) return undefined;
  const meta: Record<string, unknown> = { __raw: raw };

  const titleMatch = raw.match(/\btitle=(?:"([^"]+)"|'([^']+)'|([^\s]+))/);
  const title = titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3];
  if (title) {
    meta["data-title"] = title;
  }

  if (/\bshowLineNumbers\b/.test(raw)) {
    meta["data-line-numbers"] = "true";
  }

  return meta;
};

export const rehypeShikiOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  defaultColor: "light",
  addLanguageClass: true,
  transformers: [
    lineNumbersTransformer(),
    transformerMetaHighlight({ className: "highlighted-line" }),
    transformerNotationDiff({ classLineAdd: "diff-added", classLineRemove: "diff-removed" }),
    diffPrefixTransformer(),
  ],
  parseMetaString,
};

export const rehypePlugins = [
  rehypeNormalizeProperties,
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: { className: "heading-anchor" },
      content: {
        type: "element",
        tagName: "span",
        properties: { className: "heading-anchor-symbol" },
        children: [{ type: "text", value: "§" }],
      },
    },
  ],
  [rehypeShiki, rehypeShikiOptions],
  [
    rehypeExternalLinks,
    {
      rel: ["nofollow", "noopener", "noreferrer"],
      target: "_blank",
    },
  ],
];
