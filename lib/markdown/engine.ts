import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeReact from "rehype-react";
import * as jsxRuntime from "react/jsx-runtime";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { ReactNode } from "react";
import type { Element, Root } from "hast";
import type { Parent } from "unist";
import type { ShikiTransformer } from "shiki";
import { transformerMetaHighlight, transformerNotationDiff } from "@shikijs/transformers";

import type { MarkdownRenderOptions } from "./types";
import { resolveMarkdownFeatures } from "./features";
import type { MarkdownFeatures } from "./features";
import { createSlugger, slugifyText } from "./slugify";
import { remarkDirectives } from "./plugins/remark-directives";
import { remarkWikilinks } from "./plugins/remark-wikilinks";
import { remarkCitations } from "./plugins/remark-citations";
import { rehypeMermaid } from "./plugins/rehype-mermaid";
import { rehypeChart } from "./plugins/rehype-chart";
import { rehypeEmbeds } from "./plugins/rehype-embeds";
import { rehypeNormalizeProperties } from "./plugins/rehype-normalize";
import { markdownComponents } from "@/components/markdown/MarkdownComponents";

const shouldUse = (value: boolean | undefined) => value === true;
const shikiCache = new Map<string, Root>();

const createMetaParser = (options: MarkdownFeatures["code"]) => {
  return (metaString: string) => {
    const raw = metaString.trim();
    if (!raw) return undefined;
    const meta: Record<string, unknown> = {
      __raw: raw,
    };

    if (options.titles) {
      const match = raw.match(/\btitle=(?:"([^"]+)"|'([^']+)'|([^\s]+))/);
      const title = match?.[1] ?? match?.[2] ?? match?.[3];
      if (title) {
        meta["data-title"] = title;
      }
    }

    if (options.lineNumbers && /\bshowLineNumbers\b/.test(raw)) {
      meta["data-line-numbers"] = "true";
    }

    return meta;
  };
};

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

const getCodeTransformers = (options: MarkdownFeatures["code"]): ShikiTransformer[] => {
  const transformers: ShikiTransformer[] = [lineNumbersTransformer()];

  if (options.lineHighlight) {
    transformers.push(
      transformerMetaHighlight({
        className: "highlighted-line",
      })
    );
  }

  if (options.diff) {
    transformers.push(
      transformerNotationDiff({
        classLineAdd: "diff-added",
        classLineRemove: "diff-removed",
      }),
      diffPrefixTransformer()
    );
  }

  return transformers;
};

const rehypeParagraphAnchors = (enabled: boolean) => {
  return (tree: Root) => {
    if (!enabled) return;
    if (!tree || typeof tree !== "object") return;
    const slugger = createSlugger();
    visit(tree, "element", (node: Element) => {
      if (node.type !== "element") return;
      if (node.tagName !== "p" && node.tagName !== "li") return;
      if (node.properties?.id) return;
      const text = toString(node).trim();
      if (!text) return;
      const id = `p-${slugifyText(text, slugger)}`;
      node.properties = node.properties ?? {};
      node.properties.id = id;
      node.properties["data-anchor-target"] = "true";
      node.children = node.children ?? [];
      node.children.push({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          "data-paragraph-anchor": "true",
        },
        children: [{ type: "text", value: "#" }],
      } as Element);
    });
  };
};

const rehypeFigures = (enabled: boolean) => {
  return (tree: Root) => {
    if (!enabled) return;
    if (!tree || typeof tree !== "object") return;
    visit(tree, "element", (node: Element, index: number | undefined, parent: Parent | undefined) => {
      if (node.type !== "element") return;
      if (!parent || typeof index !== "number") return;
      if (node.tagName !== "p") return;
      const [only] = node.children ?? [];
      if (!only || only.type !== "element" || only.tagName !== "img") return;
      const title = only.properties?.title as string | undefined;
      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: {},
        children: [
          only,
          ...(title
            ? [
                {
                  type: "element",
                  tagName: "figcaption",
                  children: [{ type: "text", value: title }],
                },
              ]
            : []),
        ],
      } as Element;
    });
  };
};

export async function renderMarkdown(markdown: string, options: MarkdownRenderOptions = {}) {
  const features = resolveMarkdownFeatures(
    typeof options.features === "string" ? options.features : "blog",
    typeof options.features === "string" ? undefined : options.features
  );

  const processor = unified().use(remarkParse);
  if (features.tables || features.csvTables || features.steps || features.citations) {
    processor.use(remarkGfm);
  }

  if (features.callouts || features.images.gallery || features.steps || features.code.tabs || features.embeds) {
    processor.use(remarkDirective);
    processor.use(remarkDirectives, { features });
  }

  if (shouldUse(features.math)) {
    processor.use(remarkMath);
  }

  if (shouldUse(features.wikilinks)) {
    processor.use(remarkWikilinks, {
      existingSlugs: options.postIndex ? new Set(options.postIndex.map((post) => post.slug)) : undefined,
    });
  }

  if (shouldUse(features.citations)) {
    processor.use(remarkCitations);
  }

  processor.use(remarkRehype, { allowDangerousHtml: false });
  processor.use(rehypeNormalizeProperties);

  if (shouldUse(features.toc)) {
    processor.use(rehypeSlug);
    processor.use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: "heading-anchor",
        "data-heading-anchor": "true",
      },
      content: {
        type: "text",
        value: "#",
      },
    });
  }

  if (shouldUse(features.mermaid)) {
    processor.use(rehypeMermaid);
  }

  if (features.charts || features.csvTables) {
    processor.use(rehypeChart);
    processor.use(rehypeNormalizeProperties);
  }

  if (features.code.highlight) {
    processor.use(rehypeShiki, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: "light",
      addLanguageClass: true,
      transformers: getCodeTransformers(features.code),
      parseMetaString: createMetaParser(features.code),
      cache: shikiCache,
    });
  }

  if (shouldUse(features.math)) {
    processor.use(rehypeKatex);
  }

  if (shouldUse(features.embeds)) {
    processor.use(rehypeEmbeds);
  }

  processor.use(() => rehypeFigures(features.images.captions));
  processor.use(() => rehypeParagraphAnchors(options.paragraphAnchors ?? features.toc));

  processor.use(rehypeExternalLinks as any, {
    rel: ["nofollow", "noopener", "noreferrer"],
    target: "_blank",
  });

  processor.use(rehypeReact, {
    ...jsxRuntime,
    components: markdownComponents,
    elementAttributeNameCase: "react",
    stylePropertyNameCase: "dom",
  });

  const file = await processor.process(markdown);
  return file.result as ReactNode;
}
