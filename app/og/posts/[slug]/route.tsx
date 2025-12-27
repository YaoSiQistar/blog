import { ImageResponse } from "next/og";

import { getPostIndexBySlug } from "@/lib/content/postsIndex";
import { posterTokens } from "@/lib/poster/tokens";
import { posterConfig, resolveIssue, resolvePosterTemplate } from "@/lib/poster/config";
import { toAbsoluteUrl } from "@/lib/seo/site";
import { loadPosterFonts } from "@/lib/poster/font";

export const runtime = "nodejs";

const ogSize = posterTokens.sizes.ogSize;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const post = await getPostIndexBySlug(resolvedParams.slug, {
    includeDrafts: process.env.NODE_ENV !== "production",
  });
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const template = resolvePosterTemplate(post);
  const resolvedTemplate = post.cover ? template : "plain";
  const issue = resolveIssue(post);
  const coverUrl = post.cover ? toAbsoluteUrl(post.cover) : undefined;
  const tags = post.tags.slice(0, posterConfig.tagsMax);
  const metaItems = [post.date, post.readingTime, post.category].filter(
    (value): value is string => Boolean(value)
  );

  const fonts = await loadPosterFonts();

  const titleFontSize = 58;
  const titleLineHeight = 1.08;
  const titleMaxHeight = Math.round(titleFontSize * titleLineHeight * 3);

  const excerptFontSize = 22;
  const excerptLineHeight = 1.5;
  const excerptMaxHeight = Math.round(excerptFontSize * excerptLineHeight * 2.4);

  const showCoverFrame = resolvedTemplate === "a" && coverUrl;
  const showCoverWash = resolvedTemplate === "b" && coverUrl;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          backgroundColor: posterTokens.colors.paper,
          color: posterTokens.colors.ink,
          fontFamily: "PosterSerif, PosterCJK",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(17,24,39,0.04), transparent 60%), radial-gradient(circle at 80% 90%, rgba(30,58,138,0.06), transparent 55%)",
        }}
      >
        {showCoverWash ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(250,250,249,0.82), rgba(250,250,249,0.92)), url(${coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.7)",
              opacity: 0.9,
            }}
          />
        ) : null}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "PosterSans, PosterCJK",
              fontSize: 14,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: posterTokens.colors.muted,
            }}
          >
            <span>文章封面</span>
            <div style={{ display: "flex", gap: 12 }}>
              {post.series ? (
                <span
                  style={{
                    padding: "4px 12px",
                    border: `1px solid ${posterTokens.colors.hairline}`,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  {posterConfig.issue.seriesLabel} {post.series}
                </span>
              ) : null}
              {issue ? (
                <span
                  style={{
                    padding: "4px 12px",
                    border: `1px solid ${posterTokens.colors.hairline}`,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.6)",
                    color: posterTokens.colors.ink,
                  }}
                >
                  {posterConfig.issue.label} {issue}
                </span>
              ) : null}
            </div>
          </div>

          <div
            style={{
              height: 1,
              backgroundColor: posterTokens.colors.hairline,
              opacity: 0.6,
            }}
          />

          {showCoverFrame ? (
            <div
              style={{
                display: "flex",
                gap: 36,
                alignItems: "center",
                flex: 1,
              }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    fontSize: titleFontSize,
                    lineHeight: titleLineHeight,
                    fontWeight: 600,
                    maxHeight: titleMaxHeight,
                    overflow: "hidden",
                  }}
                >
                  {post.title}
                </div>
                {post.excerpt ? (
                  <div
                    style={{
                      fontFamily: "PosterSans, PosterCJK",
                      fontSize: excerptFontSize,
                      lineHeight: excerptLineHeight,
                      color: posterTokens.colors.muted,
                      maxHeight: excerptMaxHeight,
                      overflow: "hidden",
                    }}
                  >
                    {post.excerpt}
                  </div>
                ) : null}
                {metaItems.length ? (
                  <div
                    style={{
                      fontFamily: "PosterSans, PosterCJK",
                      fontSize: 14,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: posterTokens.colors.muted,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    {metaItems.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                ) : null}
                {tags.length ? (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "PosterSans, PosterCJK",
                          fontSize: 12,
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: posterTokens.colors.muted,
                          padding: "4px 12px",
                          border: `1px solid ${posterTokens.colors.hairline}`,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  width: 360,
                  height: 240,
                  padding: 10,
                  borderRadius: 18,
                  border: `1px solid ${posterTokens.colors.hairline}`,
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <img
                  src={coverUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 12,
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
              <div
                style={{
                  fontSize: titleFontSize,
                  lineHeight: titleLineHeight,
                  fontWeight: 600,
                  maxHeight: titleMaxHeight,
                  overflow: "hidden",
                }}
              >
                {post.title}
              </div>
              {post.excerpt ? (
                <div
                  style={{
                    fontFamily: "PosterSans, PosterCJK",
                    fontSize: excerptFontSize,
                    lineHeight: excerptLineHeight,
                    color: posterTokens.colors.muted,
                    maxHeight: excerptMaxHeight,
                    overflow: "hidden",
                  }}
                >
                  {post.excerpt}
                </div>
              ) : null}
              {metaItems.length ? (
                <div
                  style={{
                    fontFamily: "PosterSans, PosterCJK",
                    fontSize: 14,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: posterTokens.colors.muted,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  {metaItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : null}
              {tags.length ? (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "PosterSans, PosterCJK",
                        fontSize: 12,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: posterTokens.colors.muted,
                        padding: "4px 12px",
                        border: `1px solid ${posterTokens.colors.hairline}`,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <div
            style={{
              height: 1,
              backgroundColor: posterTokens.colors.hairline,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              fontFamily: "PosterSans, PosterCJK",
              fontSize: 12,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: posterTokens.colors.muted,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>封面海报</span>
            <span>{posterConfig.issue.label} {issue ?? "-"}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: ogSize.width,
      height: ogSize.height,
      fonts,
    }
  );
}
