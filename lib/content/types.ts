export type PostSort = "latest" | "hot";

export interface PostFrontmatter {
  title: string;
  date: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt?: string;
  cover?: string;
  draft: boolean;
  featured: boolean;
  pinned: boolean;
}

export interface Post extends PostFrontmatter {
  content: string;
  excerpt: string;
  readingTime: string;
  wordCount: number;
  dateISO: string;
  dateTimestamp: number;
  year: number;
  month: number;
}

export type PostIndexItem = Omit<Post, "content">;

export interface PostsPagedResult {
  items: PostIndexItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PostsQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tags?: string[];
  sort?: PostSort;
  q?: string;
  includeDrafts?: boolean;
}
