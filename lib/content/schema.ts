import { z } from "zod";

import type { PostFrontmatter } from "./types";

export const slugRegex = /^[^/]+$/;

const frontmatterSchema = z
  .object({
    title: z.string().min(1, "title is required"),
    date: z.string().min(1, "date is required"),
    slug: z.string().min(1, "slug is required").regex(slugRegex, "slug must not contain '/'"),
    category: z
      .string()
      .regex(slugRegex, "category must not contain '/'"),
    tags: z
      .array(z.string().regex(slugRegex, "tags must not contain '/'"))
      .optional()
      .default([]),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    series: z.string().optional(),
    issue: z.union([z.string(), z.number()]).optional(),
    readingTime: z.union([z.string(), z.number()]).optional(),
    poster: z.enum(["a", "b", "plain"]).optional(),
    references: z.string().optional(),
    draft: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    pinned: z.boolean().optional().default(false),
  })
  .strict();

const formatIssues = (issues: z.ZodIssue[]) =>
  issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("; ");

export function parseFrontmatter(data: unknown, filePath: string): PostFrontmatter {
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`[content] ${filePath}: ${formatIssues(result.error.issues)}`);
  }

  const parsedDate = new Date(result.data.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(
      `[content] ${filePath}: date must be a valid ISO or YYYY-MM-DD string`
    );
  }

  const tags = Array.from(
    new Set(result.data.tags.map((tag) => tag.trim()).filter(Boolean))
  );

  const issue =
    result.data.issue === undefined || result.data.issue === null
      ? undefined
      : String(result.data.issue).trim() || undefined;
  const readingTime =
    result.data.readingTime === undefined || result.data.readingTime === null
      ? undefined
      : String(result.data.readingTime).trim() || undefined;

  return {
    ...result.data,
    tags,
    issue,
    readingTime,
  };
}
