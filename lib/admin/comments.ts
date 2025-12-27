import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  AdminBatchAction,
  AdminCommentItem,
  AdminCommentStats,
} from "./types";

type ListParams = {
  status?: "pending" | "approved" | "hidden" | "spam" | "all";
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest";
};

const DEFAULT_PAGE_SIZE = 20;

const normalizeSearch = (value?: string | null) => value?.trim() || undefined;

const toStatus = (action: AdminBatchAction) => {
  if (action === "approve") return "approved";
  if (action === "hide") return "hidden";
  return "spam";
};

export async function listAdminComments(params: ListParams) {
  const status = params.status ?? "pending";
  const q = normalizeSearch(params.q);
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 10), 50);
  const sort = params.sort ?? "newest";

  let query = supabaseAdmin
    .from("comments")
    .select("id, post_slug, content, nickname, status, created_at, user_id", {
      count: "exact",
    });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (q) {
    const escaped = q.replace(/%/g, "");
    const pattern = `%${escaped}%`;
    query = query.or(`content.ilike.${pattern},nickname.ilike.${pattern},post_slug.ilike.${pattern}`);
  }

  const rangeStart = (page - 1) * pageSize;
  const rangeEnd = rangeStart + pageSize - 1;
  query = query.order("created_at", { ascending: sort === "oldest" }).range(rangeStart, rangeEnd);

  const [{ data, error, count }, stats] = await Promise.all([
    query,
    getAdminCommentStats(),
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return {
    page,
    pageSize,
    total: count ?? 0,
    items: (data ?? []) as AdminCommentItem[],
    stats,
  };
}

export async function getAdminCommentStats(): Promise<AdminCommentStats> {
  const [pending, approved, hidden] = await Promise.all([
    supabaseAdmin
      .from("comments")
      .select("id", { head: true, count: "exact" })
      .eq("status", "pending"),
    supabaseAdmin
      .from("comments")
      .select("id", { head: true, count: "exact" })
      .eq("status", "approved"),
    supabaseAdmin
      .from("comments")
      .select("id", { head: true, count: "exact" })
      .eq("status", "hidden"),
  ]);

  if (pending.error || approved.error || hidden.error) {
    throw new Error(
      pending.error?.message ||
        approved.error?.message ||
        hidden.error?.message ||
        "Failed to load moderation stats."
    );
  }

  return {
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    hidden: hidden.count ?? 0,
  };
}

export async function batchUpdateComments(ids: string[], action: AdminBatchAction) {
  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
  if (!uniqueIds.length) return { updated: 0 };
  const status = toStatus(action);

  const { data, error } = await supabaseAdmin
    .from("comments")
    .update({ status })
    .in("id", uniqueIds)
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  return { updated: data?.length ?? 0 };
}
