import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "@/components/shell/Container";
import ShareStudio from "@/components/share/ShareStudio";
import { getPosterDataBySlug } from "@/lib/poster/posterData";
import {
  posterDefaultRatio,
  posterDefaultStyle,
  posterRatios,
  posterStyles,
  type PosterRatio,
  type PosterStyleId,
} from "@/lib/poster/styles";
import { buildPageMetadata } from "@/lib/seo/og";

type SharePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const getParam = (input: Record<string, string | string[] | undefined>, key: string) => {
  const raw = input[key];
  return Array.isArray(raw) ? raw[0] ?? null : raw ?? null;
};

const resolveStyle = (value: string | null): PosterStyleId =>
  posterStyles.some((style) => style.id === value) ? (value as PosterStyleId) : posterDefaultStyle;

const resolveRatio = (value: string | null): PosterRatio =>
  Object.prototype.hasOwnProperty.call(posterRatios, value ?? "")
    ? (value as PosterRatio)
    : posterDefaultRatio;

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const resolved = await params;
  const data = await getPosterDataBySlug(resolved.slug);
  if (!data) return {};

  return buildPageMetadata({
    title: `${data.title} · 分享工作台`,
    description: `为《${data.title}》生成分享海报。`,
    pathname: `/share/posts/${data.slug}`,
  });
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const resolvedParams = await params;
  const resolvedSearch = (await searchParams) ?? {};

  const data = await getPosterDataBySlug(resolvedParams.slug);
  if (!data) notFound();

  const style = resolveStyle(getParam(resolvedSearch, "style"));
  const ratio = resolveRatio(getParam(resolvedSearch, "ratio"));

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
            分享工作台
          </div>
          <h1 className="text-3xl font-semibold text-foreground">{data.title}</h1>
          {data.excerpt ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{data.excerpt}</p>
          ) : null}
        </div>

        <ShareStudio post={data} initialStyle={style} initialRatio={ratio} />
      </Container>
    </main>
  );
}
