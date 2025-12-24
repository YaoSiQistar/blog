import { z } from "zod";

import type { PostFrontmatter } from "./types";

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const frontmatterSchema = z
  .object({
    title: z.string().min(1, "title is required"),
    date: z.string().min(1, "date is required"),
    slug: z
      .string()
      .regex(slugRegex, "slug must be lowercase and kebab-case"),
    category: z
      .string()
      .regex(slugRegex, "category must be lowercase and kebab-case"),
    tags: z
      .array(z.string().regex(slugRegex, "tags must be lowercase and kebab-case"))
      .optional()
      .default([]),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    pinned: z.boolean().optional().default(false),
  })
  .strict();

const formatIssues = (issues: z.ZodIssue[]) =>
  issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("; ");

export function parseFrontmatter(
  data: unknown,
  filePath: string,
  fileSlug: string
): PostFrontmatter {
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

  if (result.data.slug !== fileSlug) {
    throw new Error(
      `[content] ${filePath}: slug "${result.data.slug}" must match filename slug "${fileSlug}"`
    );
  }

  const tags = Array.from(
    new Set(result.data.tags.map((tag) => tag.trim()).filter(Boolean))
  );

  return {
    ...result.data,
    tags,
  };
}
