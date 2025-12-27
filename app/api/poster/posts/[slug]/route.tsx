import { ImageResponse } from "next/og";

import { getPosterDataBySlug } from "@/lib/poster/posterData";
import { loadPosterFonts } from "@/lib/poster/font";
import {
  posterDefaultRatio,
  posterDefaultStyle,
  posterRatios,
  posterStyles,
  type PosterRatio,
  type PosterStyleId,
} from "@/lib/poster/styles";
import { renderPoster } from "@/lib/poster/posterRender";

export const runtime = "nodejs";

const isStyle = (value: string | null): value is PosterStyleId =>
  posterStyles.some((style) => style.id === value);

const isRatio = (value: string | null): value is PosterRatio =>
  Object.prototype.hasOwnProperty.call(posterRatios, value ?? "");

const isThumb = (value: string | null) => value === "thumb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { searchParams } = new URL(request.url);
  const styleParam = searchParams.get("style");
  const ratioParam = searchParams.get("ratio") ?? searchParams.get("size");
  const sizeParam = searchParams.get("size");

  const style = isStyle(styleParam) ? styleParam : posterDefaultStyle;
  const ratio = isRatio(ratioParam) ? ratioParam : posterDefaultRatio;
  const thumb = isThumb(sizeParam);

  const data = await getPosterDataBySlug(resolvedParams.slug);
  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const fonts = await loadPosterFonts();
  const size = posterRatios[ratio];
  const width = thumb ? Math.round(size.width * 0.5) : size.width;
  const height = thumb ? Math.round(size.height * 0.5) : size.height;
  const response = new ImageResponse(renderPoster({ data, style, ratio }), {
    width,
    height,
    fonts,
  });

  response.headers.set("Content-Type", "image/png");
  response.headers.set("Cache-Control", "public, max-age=3600");

  return response;
}
