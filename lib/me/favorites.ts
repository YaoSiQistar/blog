import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAllPostsIndex } from "@/lib/content";
import type { PostIndexItem } from "@/lib/content/types";
import type { FavoritesSort } from "@/lib/me/query";

export type FavoriteEntry = PostIndexItem & {
  savedAt: string;
};

type FavoriteRow = {
  post_slug: string;
  created_at: string;
};

const matchesQuery = (item: PostIndexItem, q?: string) => {
  if (!q) return true;
  const needle = q.toLowerCase();
  const haystack = `${item.title} ${item.excerpt}`.toLowerCase();
  return haystack.includes(needle);
};

export async function getFavoritesForUser(userId: string, options?: { q?: string; sort?: FavoritesSort }) {
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("post_slug, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const posts = await getAllPostsIndex();
  const postMap = new Map(posts.map((post) => [post.slug, post]));

  const entries = (data ?? [])
    .map((favorite: FavoriteRow) => {
      const post = postMap.get(favorite.post_slug);
      if (!post) return null;
      return {
        ...post,
        savedAt: favorite.created_at,
      };
    })
    .filter((entry): entry is FavoriteEntry => Boolean(entry))
    .filter((entry) => matchesQuery(entry, options?.q));

  if (options?.sort === "published") {
    return [...entries].sort((a, b) => b.dateTimestamp - a.dateTimestamp);
  }

  return entries;
}
