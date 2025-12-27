import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAllPostsIndex } from "@/lib/content";
import type { PostIndexItem } from "@/lib/content/types";
import type { ActivityItem } from "@/components/me/ActivityList";

type CommentRow = {
  post_slug: string;
  created_at: string;
  status: string | null;
};

const matchesQuery = (item: PostIndexItem, q?: string) => {
  if (!q) return true;
  const needle = q.toLowerCase();
  const haystack = `${item.title} ${item.excerpt}`.toLowerCase();
  return haystack.includes(needle);
};

export async function getCommentsForUser(userId: string, options?: { q?: string }) {
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("post_slug, created_at, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const posts = await getAllPostsIndex();
  const postMap = new Map(posts.map((post) => [post.slug, post]));

  return (data ?? [])
    .map((row: CommentRow) => {
      const post = postMap.get(row.post_slug);
      if (!post) return null;
      const item: ActivityItem = {
        postSlug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        createdAt: row.created_at,
        status: row.status ?? undefined,
      };
      return item;
    })
    .filter((item): item is ActivityItem => Boolean(item))
    .filter((item) => {
      const post = postMap.get(item.postSlug);
      return post ? matchesQuery(post, options?.q) : false;
    });
}
