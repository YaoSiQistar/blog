import { renderMarkdown } from "@/lib/markdown/engine";
import type { MarkdownRenderOptions, ReferenceEntry } from "@/lib/markdown/types";
import type { MarkdownFeatureOverrides, MarkdownPresetName } from "@/lib/markdown/features";
import { resolveMarkdownFeatures } from "@/lib/markdown/features";
import type { PostIndexItem } from "@/lib/content/types";
import { MarkdownProvider } from "./MarkdownContext";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  markdown: string;
  id?: string;
  className?: string;
  features?: MarkdownPresetName | MarkdownFeatureOverrides;
  references?: ReferenceEntry[];
  postIndex?: PostIndexItem[];
  paragraphAnchors?: boolean;
};

export async function MarkdownRenderer({
  markdown,
  id = "article",
  className,
  features = "blog",
  references = [],
  postIndex = [],
  paragraphAnchors,
}: MarkdownRendererProps) {
  const resolvedFeatures = resolveMarkdownFeatures(
    typeof features === "string" ? features : "blog",
    typeof features === "string" ? undefined : features
  );
  const content = await renderMarkdown(markdown, {
    features,
    references,
    postIndex,
    paragraphAnchors,
  } as MarkdownRenderOptions);

  return (
    <MarkdownProvider value={{ features: resolvedFeatures, references, postIndex }}>
      <article
        id={id}
        className={cn("prose-ultra max-w-none", className)}
        data-markdown
      >
        {content}
      </article>
    </MarkdownProvider>
  );
}
