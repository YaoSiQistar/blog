import path from "path";
import matter from "gray-matter";

import { PAGES_DIR, readFile } from "@/lib/content/fs";
import { pageFrontmatterSchema, type PageFrontmatter } from "@/lib/pages/frontmatter";

export type PageResult = {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
  wordCount: number;
};

const countWords = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length;
};

const readPageFile = async (slug: string) => {
  const candidates = [
    path.join(PAGES_DIR, `${slug}.mdx`),
    path.join(PAGES_DIR, `${slug}.md`),
  ];

  for (const file of candidates) {
    try {
      return { file, raw: await readFile(file) };
    } catch {
      continue;
    }
  }

  return null;
};

export async function getPage(slug: string): Promise<PageResult | null> {
  const result = await readPageFile(slug);
  if (!result) return null;

  const { data, content } = matter(result.raw);
  const frontmatter = pageFrontmatterSchema.parse(data);

  return {
    slug,
    frontmatter,
    content: content.trim(),
    wordCount: countWords(content),
  };
}

export async function getAboutPage() {
  return getPage("about");
}
