import path from "path";
import { promises as fs } from "fs";
import fg from "fast-glob";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUT_PATH = path.join(process.cwd(), "public", "search-index.json");

const stripMarkdown = (value) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractHeadings = (markdown) => {
  const tree = unified().use(remarkParse).parse(markdown);
  const headings = [];
  tree.children.forEach((node) => {
    if (node.type !== "heading") return;
    if (node.depth < 2 || node.depth > 4) return;
    const text = toString(node).trim();
    if (text) headings.push(text);
  });
  return headings;
};

const files = await fg("**/*.md", { cwd: POSTS_DIR, absolute: true });

const index = [];
for (const file of files) {
  const raw = await fs.readFile(file, "utf8");
  const { data, content } = matter(raw);
  const slug = data.slug;
  if (!slug) continue;

  const stripped = stripMarkdown(content);
  index.push({
    slug,
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    headings: extractHeadings(content),
    contentText: stripped,
  });
}

await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
await fs.writeFile(OUT_PATH, JSON.stringify(index, null, 2), "utf8");

console.log(`[search-index] Wrote ${index.length} records to ${OUT_PATH}`);
