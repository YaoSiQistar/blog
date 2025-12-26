import type { MetadataRoute } from "next";

import { getAllCategories, getAllPostsIndex, getAllTags } from "@/lib/content";
import { siteConfig } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    getAllPostsIndex(),
    getAllCategories(),
    getAllTags(),
  ]);

  const now = new Date();
  const mainPages = ["/", "/posts", "/categories", "/tags", "/about"];

  const entries: MetadataRoute.Sitemap = [
    ...mainPages.map((path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${siteConfig.siteUrl}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tags.map((tag) => ({
      url: `${siteConfig.siteUrl}/tags/${tag.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];

  return entries;
}
