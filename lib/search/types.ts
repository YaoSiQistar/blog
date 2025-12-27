export type SearchScope = "all" | "title" | "content" | "tags";
export type SearchSort = "relevance" | "latest";

export type SearchQueryState = {
  q?: string;
  page: number;
  sort: SearchSort;
  scope: SearchScope;
  category?: string;
  tags: string[];
};

export type SearchResultItem = {
  title: string;
  slug: string;
  excerpt: string;
  snippet: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: string;
  score: number;
};

export type SearchIndexItem = {
  slug: string;
  title: string;
  excerpt: string;
  contentText: string;
  headings: string[];
  category: string;
  tags: string[];
  date: string;
  dateTimestamp: number;
  readingTime: string;
  cover?: string;
};

export type SearchResultsPage = {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  elapsedMs?: number;
};
