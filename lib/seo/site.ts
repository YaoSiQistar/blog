const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const rawSiteName = process.env.NEXT_PUBLIC_SITE_NAME;
const rawAuthorName = process.env.NEXT_PUBLIC_AUTHOR_NAME;

if (!rawSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required for SEO metadata.");
}

const siteUrl = rawSiteUrl.replace(/\/+$/, "");
const authorName = rawAuthorName?.trim() || "作者";
const siteName = rawSiteName?.trim() || `${authorName}的博客`;

export const siteConfig = {
  siteUrl,
  siteName,
  defaultTitle: siteName,
  defaultDescription:
    "暖纸张编辑部风格的个人博客：内容来自 Git/Markdown，互动由 Supabase 提供。",
  defaultOg: "/og-default.svg",
};

export const toAbsoluteUrl = (value: string) => {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${siteConfig.siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

export const buildCanonical = (pathname: string) => {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteConfig.siteUrl}${normalized}`;
};
