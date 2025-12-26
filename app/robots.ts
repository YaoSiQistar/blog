import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/login", "/register", "/me"],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
