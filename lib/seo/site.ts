const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!rawSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required for SEO metadata.");
}

const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  siteUrl,
  siteName: "Editorial Journal",
  defaultTitle: "Editorial Journal",
  defaultDescription:
    "Warm paper editorial blog built with Next.js, Tailwind, and Supabase engagement.",
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
