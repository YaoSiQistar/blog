import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const remarkPlugins = [remarkGfm];

export const rehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
  onVisitLine(node: { children?: { value: string }[] }) {
    if (!node.children?.length) node.children = [{ value: "" }];
  },
  onVisitHighlightedLine(node: { properties?: Record<string, string[]> }) {
    node.properties = node.properties ?? {};
    node.properties.className = [...(node.properties.className ?? []), "highlighted-line"];
  },
};

export const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: { className: ["heading-anchor"] },
      content: {
        type: "element",
        tagName: "span",
        properties: { className: ["heading-anchor-symbol"] },
        children: [{ type: "text", value: "§" }],
      },
    },
  ],
  [rehypePrettyCode, rehypePrettyCodeOptions],
  [
    rehypeExternalLinks,
    {
      rel: ["nofollow", "noopener", "noreferrer"],
      target: "_blank",
    },
  ],
];
