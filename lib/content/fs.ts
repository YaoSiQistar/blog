import path from "path";
import fg from "fast-glob";
import { promises as fs } from "fs";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const POSTS_DIR = path.join(CONTENT_ROOT, "posts");
export const PAGES_DIR = path.join(CONTENT_ROOT, "pages");

export async function getPostFilePaths(): Promise<string[]> {
  return fg("**/*.md", {
    cwd: POSTS_DIR,
    onlyFiles: true,
    absolute: true,
  });
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

export function getSlugFromFilename(filePath: string): string {
  return path.basename(filePath, ".md");
}

export async function getContentSignature(files: string[]): Promise<string> {
  const stats = await Promise.all(
    files.map(async (file) => {
      const stat = await fs.stat(file);
      return `${file}:${stat.mtimeMs}`;
    })
  );

  return stats.join("|");
}
