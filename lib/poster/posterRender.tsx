import type { ReactElement } from "react";

import { posterShareTokens } from "@/lib/poster/tokens";
import type { PosterData } from "@/lib/poster/posterData";
import {  type PosterRatio, type PosterStyleId } from "@/lib/poster/styles";
import { toAbsoluteUrl } from "@/lib/seo/site";

type RenderInput = {
  data: PosterData;
  style: PosterStyleId;
  ratio: PosterRatio;
};

const tokens = posterShareTokens;

const resolveCoverUrl = (cover?: string) => {
  if (!cover) return undefined;
  if (cover.startsWith("http://") || cover.startsWith("https://")) return cover;
  if (cover.startsWith("/")) return toAbsoluteUrl(cover);
  return cover;
};

const buildTags = (tags: string[], max = 3) => {
  const visible = tags.slice(0, max);
  const extra = Math.max(0, tags.length - visible.length);
  return { visible, extra };
};

const MetaRow = ({ items }: { items: string[] }) => (
  <div
    style={{
      fontFamily: "PosterSans, PosterCJK",
      fontSize: tokens.type.meta.fontSize,
      letterSpacing: tokens.type.meta.letterSpacing,
      textTransform: "uppercase",
      color: tokens.colors.muted,
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
    }}
  >
    {items.map((item) => (
      <span key={item}>{item}</span>
    ))}
  </div>
);

const TagRow = ({ tags }: { tags: string[] }) => {
  if (!tags.length) return null;
  const { visible, extra } = buildTags(tags);

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {visible.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "PosterSans, PosterCJK",
            fontSize: tokens.type.tag.fontSize,
            letterSpacing: tokens.type.tag.letterSpacing,
            textTransform: "uppercase",
            color: tokens.colors.muted,
            padding: "4px 12px",
            border: `1px solid ${tokens.colors.hairline}`,
            borderRadius: 999,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          {tag}
        </span>
      ))}
      {extra > 0 ? (
        <span
          style={{
            fontFamily: "PosterSans, PosterCJK",
            fontSize: tokens.type.tag.fontSize,
            letterSpacing: tokens.type.tag.letterSpacing,
            textTransform: "uppercase",
            color: tokens.colors.muted,
            padding: "4px 12px",
            border: `1px solid ${tokens.colors.hairline}`,
            borderRadius: 999,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
};

const Hairline = () => (
  <div style={{ height: 1, backgroundColor: tokens.colors.hairline, opacity: 0.6 }} />
);

const PosterBase = ({
  children,
  mono = false,
}: {
  children: ReactElement | ReactElement[];
  mono?: boolean;
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: tokens.spacing.padding,
      backgroundColor: tokens.colors.paper,
      color: mono ? tokens.colors.inkMono : tokens.colors.ink,
      position: "relative",
      fontFamily: "PosterSerif, PosterCJK",
      backgroundImage:
        "radial-gradient(circle at 20% 10%, rgba(17,24,39,0.04), transparent 60%), radial-gradient(circle at 80% 90%, rgba(30,58,138,0.06), transparent 55%)",
    }}
  >
    {children}
  </div>
);

const renderPaperEditorial = ({ data }: RenderInput) => {
  const meta = [data.date, data.readingTime, data.category].filter(
    (item): item is string => Boolean(item)
  );

  return (
    <PosterBase>
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.gap }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "PosterSans, PosterCJK",
            fontSize: 14,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: tokens.colors.muted,
          }}
        >
          <span>{data.siteName}</span>
          <span>{data.issue ?? data.date.slice(0, 7)}</span>
        </div>
        <Hairline />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: tokens.type.title.fontSize,
              lineHeight: tokens.type.title.lineHeight,
              fontWeight: 600,
              maxHeight: Math.round(tokens.type.title.fontSize * tokens.type.title.lineHeight * 3),
              overflow: "hidden",
            }}
          >
            {data.title}
          </div>
          {data.excerpt ? (
            <div
              style={{
                fontFamily: "PosterSans, PosterCJK",
                fontSize: tokens.type.excerpt.fontSize,
                lineHeight: tokens.type.excerpt.lineHeight,
                color: tokens.colors.muted,
                maxHeight: Math.round(tokens.type.excerpt.fontSize * tokens.type.excerpt.lineHeight * 2.4),
                overflow: "hidden",
              }}
            >
              {data.excerpt}
            </div>
          ) : null}
          {meta.length ? <MetaRow items={meta} /> : null}
          <TagRow tags={data.tags} />
        </div>
        <Hairline />
        <div
          style={{
            fontFamily: "PosterSans, PosterCJK",
            fontSize: 12,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: tokens.colors.muted,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{data.authorName}</span>
          <span>{data.siteName}</span>
        </div>
      </div>
    </PosterBase>
  );
};

const renderMuseumPlaque = ({ data }: RenderInput) => {
  const meta = [data.date, data.readingTime].filter((item): item is string => Boolean(item));
  return (
    <PosterBase>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 28,
          height: "100%",
        }}
      >
        <div
          style={{
            minWidth: 200,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            border: `1px solid ${tokens.colors.hairline}`,
            padding: 20,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <div
            style={{
              fontFamily: "PosterSans, PosterCJK",
              fontSize: 12,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: tokens.colors.muted,
            }}
          >
            {data.siteName}
          </div>
          <div style={{ fontSize: 42, fontWeight: 600, marginTop: 12 }}>
            {data.issue ?? data.date.slice(0, 4)}
          </div>
          <div style={{ marginTop: 12, display: "flex" }}>
            <Hairline />
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: "PosterSans, PosterCJK",
              fontSize: 13,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: tokens.colors.muted,
            }}
          >
            展签
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 600 }}>{data.title}</div>
          {data.excerpt ? (
            <div
              style={{
                fontFamily: "PosterSans, PosterCJK",
                fontSize: 20,
                lineHeight: 1.5,
                color: tokens.colors.muted,
                maxHeight: 120,
                overflow: "hidden",
              }}
            >
              {data.excerpt}
            </div>
          ) : null}
          {meta.length ? <MetaRow items={meta} /> : null}
          <TagRow tags={data.tags} />
        </div>
      </div>
    </PosterBase>
  );
};

const renderTypeGrid = ({ data }: RenderInput) => {
  const meta = [data.date, data.category].filter((item): item is string => Boolean(item));
  return (
    <PosterBase>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 600 }}>{data.title}</div>
          </div>
          <div style={{ minWidth: 180, display: "flex", flexDirection: "column" }}>
            {meta.length ? <MetaRow items={meta} /> : null}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, flex: 1 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${tokens.colors.hairline}`,
              padding: 16,
              background: "rgba(255,255,255,0.6)",
            }}
          >
            <div
              style={{
                fontFamily: "PosterSans, PosterCJK",
                fontSize: 18,
                lineHeight: 1.6,
                color: tokens.colors.muted,
                maxHeight: 180,
                overflow: "hidden",
              }}
            >
              {data.excerpt ?? "编辑部栅格注释。"}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontFamily: "PosterSans, PosterCJK",
                fontSize: 12,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: tokens.colors.muted,
              }}
            >
              {data.siteName}
            </div>
            <TagRow tags={data.tags} />
          </div>
        </div>
      </div>
    </PosterBase>
  );
};

const renderMonoInk = ({ data }: RenderInput) => {
  return (
    <PosterBase mono>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily: "PosterSans, PosterCJK",
            fontSize: 12,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: tokens.colors.inkMono,
          }}
        >
          {data.siteName}
        </div>
        <Hairline />
        <div style={{ fontSize: 60, lineHeight: 1.05, fontWeight: 600 }}>{data.title}</div>
        <TagRow tags={data.tags} />
        <Hairline />
        <div
          style={{
            fontFamily: "PosterSans, PosterCJK",
            fontSize: 12,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: tokens.colors.inkMono,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{data.authorName}</span>
          <span>{data.date}</span>
        </div>
      </div>
    </PosterBase>
  );
};

export function renderPoster({ data, style, ratio }: RenderInput): ReactElement {
  switch (style) {
    case "paper-editorial":
      return renderPaperEditorial({ data, style, ratio });
    case "museum-plaque":
      return renderMuseumPlaque({ data, style, ratio });
    case "type-grid":
      return renderTypeGrid({ data, style, ratio });
    case "mono-ink":
      return renderMonoInk({ data, style, ratio });
    default:
      return renderPaperEditorial({ data, style, ratio });
  }
}

