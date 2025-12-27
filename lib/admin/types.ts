export type AdminCommentStatus = "pending" | "approved" | "hidden" | "spam";

export type AdminCommentItem = {
  id: string;
  post_slug: string;
  content: string;
  nickname: string | null;
  status: AdminCommentStatus;
  created_at: string;
  user_id: string | null;
};

export type AdminCommentStats = {
  pending: number;
  approved: number;
  hidden: number;
  spam?: number;
};

export type AdminCommentsResponse = {
  ok: true;
  page: number;
  pageSize: number;
  total: number;
  items: AdminCommentItem[];
  stats: AdminCommentStats;
};

export type AdminBatchAction = "approve" | "hide" | "spam";
