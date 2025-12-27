import "server-only";

import { getAllPostsIndex } from "@/lib/content";

export type PostsIndexMap = Record<string, { title: string }>;

export async function getPostsIndexMap(): Promise<PostsIndexMap> {
  const posts = await getAllPostsIndex();
  return posts.reduce<PostsIndexMap>((acc, post) => {
    acc[post.slug] = { title: post.title };
    return acc;
  }, {});
}
