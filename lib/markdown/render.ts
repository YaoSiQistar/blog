import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import { rehypePlugins, remarkPlugins } from "./remark";

export async function renderMarkdown(markdown: string) {
  const processor = unified().use(remarkParse);
  processor.use(remarkPlugins as any);
  processor.use(remarkRehype, { allowDangerousHtml: false });
  processor.use(rehypePlugins as any);
  processor.use(rehypeStringify);

  const file = await processor.process(markdown);
  return String(file);
}
