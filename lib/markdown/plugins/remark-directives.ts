import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

import type { MarkdownFeatures } from "../features";

type Directive = {
  type: string;
  name?: string;
  attributes?: Record<string, string | number | boolean | undefined>;
  label?: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

const toTitle = (node: Directive) =>
  (node.attributes?.title as string | undefined) ||
  (node.label as string | undefined) ||
  undefined;

const setData = (node: Directive, hName: string, hProperties: Record<string, unknown>) => {
  node.data = node.data ?? {};
  node.data.hName = hName;
  node.data.hProperties = {
    ...(node.data.hProperties ?? {}),
    ...hProperties,
  };
};

export const remarkDirectives: Plugin<[ { features: MarkdownFeatures } ], Root> = ({ features }) => {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (!node || typeof node !== "object") return;
      const directive = node as Directive;
      const name = directive.name?.toLowerCase();

      if (directive.type === "textDirective") {
        if (!parent || typeof index !== "number") return;
        const label = "children" in directive ? toString(directive as any).trim() : "";
        const value = label || (directive.name ? `:${directive.name}` : "");
        parent.children[index] = { type: "text", value };
        return;
      }

      if (directive.type === "containerDirective") {
        if (name === "note" || name === "tip" || name === "warning" || name === "danger" || name === "theorem") {
          if (!features.callouts && name !== "theorem") return;
          if (name === "theorem" && !features.math) return;
          setData(directive, "Callout", {
            variant: name,
            title: toTitle(directive),
          });
          return;
        }

        if (name === "tabs") {
          if (!features.code.tabs) return;
          setData(directive, "CodeTabs", {
            id: directive.attributes?.id ?? undefined,
          });
          return;
        }

        if (name === "tab") {
          if (!features.code.tabs) return;
          setData(directive, "CodeTab", {
            label: (directive.attributes?.label as string | undefined) ?? toTitle(directive),
            value: directive.attributes?.value,
          });
          return;
        }

        if (name === "gallery") {
          if (!features.images.gallery) return;
          setData(directive, "Gallery", {
            columns: directive.attributes?.columns,
          });
          return;
        }

        if (name === "steps") {
          if (!features.steps) return;
          setData(directive, "Steps", {
            title: toTitle(directive),
          });
          return;
        }

        if (name === "step") {
          if (!features.steps) return;
          setData(directive, "Step", {
            title: toTitle(directive),
          });
          return;
        }
      }

      if (directive.type === "leafDirective") {
        if (name === "embed") {
          if (!features.embeds) return;
          setData(directive, "embed", {
            url: directive.attributes?.url,
            title: directive.attributes?.title,
            description: directive.attributes?.description,
          });
          return;
        }

        if (name === "post") {
          if (!features.embeds) return;
          setData(directive, "post", {
            slug: directive.attributes?.slug,
          });
          return;
        }
      }
    });
  };
};
