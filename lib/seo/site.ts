const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!rawSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required for SEO metadata.");
}

const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  siteUrl,
  siteName: "个人博客",
  defaultTitle: "个人博客",
  defaultDescription:
    "基于 Next.js、Tailwind 与 Supabase 互动的暖纸质感编辑部博客。",
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
