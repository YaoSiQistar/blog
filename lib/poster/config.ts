import type { PostIndexItem } from "@/lib/content/types";
import type { PosterTemplate } from "./tokens";

export const posterConfig = {
  templates: {
    default: "plain" as PosterTemplate,
    withCover: "a" as PosterTemplate,
  },
  tagsMax: 3,
  enableGrain: true,
  issue: {
    mode: "monthly" as "monthly" | "yearly",
    label: "期号",
    seriesLabel: "系列",
  },
};

const pad2 = (value: number) => String(value).padStart(2, "0");

export const resolveIssue = (post: Pick<PostIndexItem, "issue" | "date">) => {
  if (post.issue) return post.issue;
  const date = new Date(post.date);
  if (Number.isNaN(date.getTime())) return undefined;
  if (posterConfig.issue.mode === "yearly") {
    return String(date.getFullYear());
  }
  return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}`;
};

export const resolvePosterTemplate = (post: Pick<PostIndexItem, "cover" | "poster">) => {
  if (post.poster) return post.poster;
  if (post.cover) return posterConfig.templates.withCover;
  return posterConfig.templates.default;
};
