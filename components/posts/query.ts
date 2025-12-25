"use client";

import type { ReadonlyURLSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { PostSort } from "@/lib/content/types";

// 最大标签数量限制
const MAX_TAGS = 5;

// 定义文章查询状态类型
// 包含分类、标签、搜索词、排序方式和页码
export type PostsQueryState = {
  category?: string;  // 文章分类
  tags: string[];     // 标签数组
  q?: string;         // 搜索词
  sort: PostSort;     // 排序方式（最新或热门）
  page: number;       // 当前页码
};

// 解析数字参数的辅助函数
// 如果参数无效则返回默认值
const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// 解析标签参数的辅助函数
// 将逗号分隔的字符串转换为去重后的标签数组
const parseTags = (value: string | null) => {
  if (!value) return [];
  const tags = value
    .split(",")
    .map((tag) => tag.trim())  // 去除每个标签的首尾空格
    .filter((tag) => tag.length > 0);  // 过滤空标签
  return Array.from(new Set(tags));  // 去重
};

// 从URL搜索参数解析文章查询状态
// 从URL参数中提取分类、标签、搜索词、排序和页码信息
export function parsePostsQuery(params: ReadonlyURLSearchParams): PostsQueryState {
  return {
    category: params.get("category") || undefined,  // 获取分类参数
    tags: parseTags(params.get("tags")),           // 解析标签参数
    q: params.get("q") || undefined,               // 获取搜索词参数
    sort: params.get("sort") === "hot" ? "hot" : "latest",  // 获取排序参数，默认为最新
    page: parseNumber(params.get("page"), 1),      // 获取页码参数，默认为1
  };
}

// 根据查询状态构建URL路径
// 将查询状态转换为带参数的URL路径
export function buildPostsHref(state: PostsQueryState) {
  const query = new URLSearchParams();
  if (state.category) query.set("category", state.category);      // 设置分类参数
  if (state.tags.length > 0) query.set("tags", state.tags.join(","));  // 设置标签参数
  if (state.q) query.set("q", state.q);                          // 设置搜索词参数
  if (state.sort !== "latest") query.set("sort", state.sort);    // 设置排序参数（如果不是默认值）
  if (state.page > 1) query.set("page", String(state.page));     // 设置页码参数（如果不是第一页）

  const qs = query.toString();
  return qs.length > 0 ? `/posts?${qs}` : "/posts";  // 如果有参数则拼接查询字符串，否则返回基础路径
}

// 更新文章查询的选项类型
type UpdatePostsQueryOptions = {
  next: Partial<PostsQueryState>;  // 要更新的查询状态部分
  resetPage?: boolean;             // 是否重置页码为1
};

// 更新文章查询状态和URL
// 根据当前参数和新的状态更新查询状态，并生成新的URL
export function updatePostsQuery(
  params: ReadonlyURLSearchParams,
  { next, resetPage = false }: UpdatePostsQueryOptions
) {
  // 解析当前URL参数为查询状态
  const current = parsePostsQuery(params);
  
  // 合并当前状态和新状态
  const merged: PostsQueryState = {
    ...current,
    ...next,
    tags: next.tags ? Array.from(new Set(next.tags)) : current.tags,  // 更新标签时去重
  };

  // 检查标签数量是否超过最大限制
  if (merged.tags.length > MAX_TAGS) {
    toast.info(`Select up to ${MAX_TAGS} tags.`);  // 显示提示信息
    return { href: null, state: current, blocked: true };  // 返回原始状态，阻止更新
  }

  // 检查是否有过滤条件发生变化
  const filterChanged =
    next.category !== undefined ||
    next.tags !== undefined ||
    next.sort !== undefined ||
    next.q !== undefined;

  // 如果过滤条件改变或需要重置页面，并且没有显式设置页码，则将页码重置为1
  if ((filterChanged || resetPage) && next.page === undefined) {
    merged.page = 1;
  }

  // 返回新的URL路径、合并后的状态和是否被阻止的标志
  return { href: buildPostsHref(merged), state: merged, blocked: false };
}