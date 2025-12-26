import { buildCanonical, siteConfig, toAbsoluteUrl } from "./site";

type ArticleInput = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  cover?: string | null;
};

const cleanObject = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => cleanObject(item))
      .filter((item) => item !== undefined && item !== null);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, val]) => [key, cleanObject(val)] as const)
      .filter(([, val]) => val !== undefined && val !== null);
    if (entries.length === 0) return undefined;
    return Object.fromEntries(entries);
  }

  return value === undefined || value === null ? undefined : value;
};

export function buildArticleJsonLd(post: ArticleInput) {
  const canonical = buildCanonical(`/posts/${post.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: siteConfig.siteName,
    },
    image: post.cover ? [toAbsoluteUrl(post.cover)] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  return cleanObject(jsonLd);
}
