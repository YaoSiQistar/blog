import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/share/",
        "/search",
        "/login",
        "/register",
        "/me",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
