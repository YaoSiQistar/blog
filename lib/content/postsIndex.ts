import "server-only";

import { getAllPostsIndex } from "@/lib/content";
import type { PostIndexItem } from "@/lib/content/types";

export type PostsIndexMap = Record<string, { title: string }>;

export async function getPostsIndexMap(): Promise<PostsIndexMap> {
  const posts = await getAllPostsIndex();
  return posts.reduce<PostsIndexMap>((acc, post) => {
    acc[post.slug] = { title: post.title };
    return acc;
  }, {});
}

export async function getPostIndexBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<PostIndexItem | null> {
  const posts = await getAllPostsIndex(options);
  return posts.find((post) => post.slug === slug) ?? null;
}
