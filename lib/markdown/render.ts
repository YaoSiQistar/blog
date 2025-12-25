import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import { rehypePlugins, remarkPlugins } from "./remark";

type PluginEntry = Parameters<ReturnType<typeof unified>["use"]>[0];

function applyPlugins(processor: ReturnType<typeof unified>, plugins: PluginEntry[]) {
  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      processor.use(plugin[0], ...plugin.slice(1));
    } else {
      processor.use(plugin);
    }
  });
}

export async function renderMarkdown(markdown: string) {
  const processor = unified().use(remarkParse);
  applyPlugins(processor, remarkPlugins);
  processor.use(remarkRehype, { allowDangerousHtml: false });
  applyPlugins(processor, rehypePlugins);
  processor.use(rehypeStringify);

  const file = await processor.process(markdown);
  return String(file);
}
