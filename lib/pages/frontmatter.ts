import { z } from "zod";

export const pageLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const pageFaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const pageCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const pageFrontmatterSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  slug: z.string().optional(),
  date: z.string().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  location: z.string().optional(),
  role: z.string().optional(),
  now: z.string().optional(),
  email: z.string().email().optional(),
  links: z.array(pageLinkSchema).optional(),
  highlights: z.array(z.string().min(1)).optional(),
  faq: z.array(pageFaqSchema).optional(),
  lead: z.array(z.string().min(1)).optional(),
  cta: z
    .object({
      primary: pageCtaSchema,
      secondary: pageCtaSchema.optional(),
      tertiary: pageCtaSchema.optional(),
    })
    .optional(),
});

export type PageFrontmatter = z.infer<typeof pageFrontmatterSchema>;
