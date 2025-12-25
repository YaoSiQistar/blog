import { renderMarkdown } from "@/lib/markdown/render";

type MarkdownRendererProps = {
  markdown: string;
};

export async function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const html = await renderMarkdown(markdown);
  return (
    <article
      id="article"
      className="prose max-w-none prose:prose-a:font-medium prose:prose-a:text-primary prose:prose-a:transition prose:prose-a:border-b prose:prose-a:border-transparent prose:prose-a:hover:border-primary prose:prose-img:rounded-2xl prose:prose-img:border prose:prose-img:border-border prose:prose-img:bg-card/60 prose:prose-blockquote:border-l-2 prose:prose-blockquote:border-border prose:prose-blockquote:bg-card/60 prose:prose-ol:list-outside prose:prose-ul:list-disc"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
