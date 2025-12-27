import { getAllPostsIndex } from "@/lib/content";
import { siteConfig } from "@/lib/seo/site";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = await getAllPostsIndex();
  const latest = posts.slice(0, 20);
  const now = new Date();

  const items = latest
    .map((post) => {
      const link = `${siteConfig.siteUrl}/posts/${post.slug}`;
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${link}</link>`,
        `<guid isPermaLink="true">${link}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.excerpt)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const rss = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">",
    "<channel>",
    `<title>${escapeXml(siteConfig.siteName)}</title>`,
    `<link>${siteConfig.siteUrl}</link>`,
    `<description>${escapeXml(siteConfig.defaultDescription)}</description>`,
    `<language>zh-CN</language>`,
    `<lastBuildDate>${now.toUTCString()}</lastBuildDate>`,
    `<atom:link href=\"${siteConfig.siteUrl}/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
