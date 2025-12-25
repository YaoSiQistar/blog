import type { Post } from "@/lib/content/types";
import { buildSnippet } from "./snippet";
import type { SearchQueryState, SearchResultItem, SearchResultsPage } from "./types";

const DEFAULT_PAGE_SIZE = 8;

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (query: string) =>
  query
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0);

const scoreField = (value: string, tokens: string[], weight: number) => {
  if (!value) return { score: 0, count: 0, firstIndex: -1 };
  const lower = value.toLowerCase();
  let count = 0;
  let firstIndex = -1;

  tokens.forEach((token) => {
    let index = lower.indexOf(token);
    while (index !== -1) {
      count += 1;
      if (firstIndex === -1 || index < firstIndex) firstIndex = index;
      index = lower.indexOf(token, index + token.length);
    }
  });

  if (count === 0) return { score: 0, count, firstIndex };

  const positionBonus =
    firstIndex >= 0 ? (1 - Math.min(firstIndex / Math.max(lower.length, 1), 1)) * 0.6 : 0;
  return {
    score: count * weight + positionBonus,
    count,
    firstIndex,
  };
};

const getSnippetSource = (plainContent: string, excerpt: string, query: string) => {
  const lower = plainContent.toLowerCase();
  const tokens = tokenize(query);
  const hasContentMatch = tokens.some((token) => lower.includes(token));
  if (hasContentMatch) return plainContent;
  return excerpt || plainContent;
};

export function searchPosts(
  posts: Post[],
  state: SearchQueryState,
  pageSize = DEFAULT_PAGE_SIZE
): SearchResultsPage {
  const start = Date.now();
  const q = state.q?.trim() ?? "";
  const tokens = tokenize(q);

  if (!q || tokens.length === 0) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 1,
      elapsedMs: Date.now() - start,
    };
  }

  const filtered = posts.filter((post) => {
    if (state.category && post.category !== state.category) return false;
    if (state.tags.length > 0 && !state.tags.every((tag) => post.tags.includes(tag))) return false;
    return true;
  });

  const results: SearchResultItem[] = [];
  const dateMap = new Map(filtered.map((post) => [post.slug, post.dateTimestamp]));

  filtered.forEach((post) => {
    const plainContent = stripMarkdown(post.content);
    const scope = state.scope;
    let score = 0;

    if (scope === "all" || scope === "title") {
      score += scoreField(post.title, tokens, 3).score;
    }

    if (scope === "all" || scope === "tags") {
      score += scoreField(post.tags.join(" "), tokens, 2.1).score;
      score += scoreField(post.category, tokens, 1.6).score;
    }

    if (scope === "all" || scope === "content") {
      score += scoreField(plainContent, tokens, 1).score;
    }

    if (score <= 0) return;

    const source = getSnippetSource(plainContent, post.excerpt, q);
    const snippet = buildSnippet(source, q, 85);

    results.push({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      snippet,
      category: post.category,
      tags: post.tags,
      date: post.date,
      readingTime: post.readingTime,
      score,
    });
  });

  const sorted = [...results].sort((a, b) => {
    const dateA = dateMap.get(a.slug) ?? 0;
    const dateB = dateMap.get(b.slug) ?? 0;
    if (state.sort === "latest") {
      return dateB - dateA;
    }
    if (b.score !== a.score) return b.score - a.score;
    return dateB - dateA;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(state.page, 1), totalPages);
  const offset = (page - 1) * pageSize;
  const items = sorted.slice(offset, offset + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    elapsedMs: Date.now() - start,
  };
}
