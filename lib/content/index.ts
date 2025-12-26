import matter from "gray-matter";

import { getEngagementScoresForSlugs } from "@/lib/engagement/queries";
import { getContentSignature, getPostFilePaths, getSlugFromFilename, readFile } from "./fs";
import { parseFrontmatter, slugRegex } from "./schema";
import type {
  Post,
  PostIndexItem,
  PostsPagedResult,
  PostsQueryParams,
} from "./types";

interface ContentCache {
  posts: Post[];
  index: PostIndexItem[];
  signature: string;
}

let cache: ContentCache | null = null;

const WORDS_PER_MINUTE = 360;

const estimateReadingTime = (wordCount: number) =>
  Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const createExcerpt = (content: string, maxLength = 160) => {
  const stripped = stripMarkdown(content);
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength).trim()}...`;
};

const sortByDateDesc = <T extends { dateTimestamp: number }>(items: T[]) =>
  [...items].sort((a, b) => b.dateTimestamp - a.dateTimestamp);

const sortByHot = async <T extends { slug: string; dateTimestamp: number }>(items: T[]) => {
  const scores = await getEngagementScoresForSlugs(items.map((item) => item.slug));
  return [...items].sort((a, b) => {
    const diff = (scores[b.slug] ?? 0) - (scores[a.slug] ?? 0);
    if (diff !== 0) return diff;
    return b.dateTimestamp - a.dateTimestamp;
  });
};

const toIndexItem = (post: Post): PostIndexItem => {
  const { content, ...rest } = post;
  void content;
  return rest;
};

async function loadPostsFromFiles(files: string[], signature: string): Promise<ContentCache> {
  const slugs = new Set<string>();
  const posts: Post[] = [];

  for (const file of files) {
    const raw = await readFile(file);
    const { data, content } = matter(raw);
    const fileSlug = getSlugFromFilename(file);
    const frontmatter = parseFrontmatter(data, file, fileSlug);

    if (!slugRegex.test(frontmatter.slug)) {
      throw new Error(`[content] ${file}: slug must be kebab-case`);
    }

    if (slugs.has(frontmatter.slug)) {
      throw new Error(`[content] Duplicate slug detected: ${frontmatter.slug}`);
    }
    slugs.add(frontmatter.slug);

    const normalizedContent = content.trim();
    const wordCount = normalizedContent
      ? normalizedContent.split(/\s+/).length
      : 0;
    const readingTime = `${estimateReadingTime(wordCount)} min`;
    const excerpt = frontmatter.excerpt?.trim() || createExcerpt(normalizedContent);
    const parsedDate = new Date(frontmatter.date);

    posts.push({
      ...frontmatter,
      content: normalizedContent,
      excerpt,
      readingTime,
      wordCount,
      dateISO: parsedDate.toISOString(),
      dateTimestamp: parsedDate.getTime(),
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth() + 1,
    });
  }

  const sortedPosts = sortByDateDesc(posts);
  const index = sortedPosts.map((post) => toIndexItem(post));

  return {
    posts: sortedPosts,
    index,
    signature,
  };
}

async function getContentCache(): Promise<ContentCache> {
  const files = await getPostFilePaths();
  const signature = await getContentSignature(files);

  if (!cache) {
    cache = await loadPostsFromFiles(files, signature);
    return cache;
  }

  if (process.env.NODE_ENV === "development" && cache.signature !== signature) {
    cache = await loadPostsFromFiles(files, signature);
  }

  return cache;
}

const filterDrafts = <T extends { draft: boolean }>(items: T[], includeDrafts?: boolean) =>
  includeDrafts ? items : items.filter((item) => !item.draft);

export async function getAllPostsIndex(options: { includeDrafts?: boolean } = {}): Promise<PostIndexItem[]> {
  const { index } = await getContentCache();
  return filterDrafts(index, options.includeDrafts);
}

export async function getAllPosts(options: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const { posts } = await getContentCache();
  return filterDrafts(posts, options.includeDrafts);
}

export async function getPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<Post | null> {
  const { posts } = await getContentCache();
  const post = posts.find((item) => item.slug === slug);

  if (!post) return null;
  if (post.draft && !options.includeDrafts) return null;

  return post;
}

export async function getPostsPaged(params: PostsQueryParams): Promise<PostsPagedResult> {
  const {
    page = 1,
    pageSize = 6,
    category,
    tags = [],
    sort = "latest",
    q,
    includeDrafts = false,
  } = params;

  const { posts } = await getContentCache();
  let filtered = filterDrafts(posts, includeDrafts);

  if (category) {
    filtered = filtered.filter((post) => post.category === category);
  }

  if (tags.length > 0) {
    filtered = filtered.filter((post) => tags.every((tag) => post.tags.includes(tag)));
  }

  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
      return haystack.includes(needle);
    });
  }

  const sorted = sort === "hot" ? await sortByHot(filtered) : sortByDateDesc(filtered);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize).map((post) => toIndexItem(post));

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getAllCategories(): Promise<{ slug: string; count: number }[]> {
  const { index } = await getContentCache();
  const counts = new Map<string, number>();

  for (const post of index) {
    if (post.draft) continue;
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllTags(): Promise<{ slug: string; count: number }[]> {
  const { index } = await getContentCache();
  const counts = new Map<string, number>();

  for (const post of index) {
    if (post.draft) continue;
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getHotTags(): Promise<{ slug: string; count: number }[]> {
  const index = await getAllPostsIndex();
  const scores = await getEngagementScoresForSlugs(index.map((post) => post.slug));
  const counts = new Map<string, { count: number; score: number }>();

  for (const post of index) {
    const postScore = scores[post.slug] ?? 0;
    for (const tag of post.tags) {
      const entry = counts.get(tag) ?? { count: 0, score: 0 };
      entry.count += 1;
      entry.score += postScore;
      counts.set(tag, entry);
    }
  }

  return Array.from(counts.entries())
    .map(([slug, data]) => ({ slug, count: data.count, score: data.score }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.count !== a.count) return b.count - a.count;
      return a.slug.localeCompare(b.slug);
    })
    .map(({ slug, count }) => ({ slug, count }));
}
