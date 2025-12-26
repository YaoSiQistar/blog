import type { Metadata } from "next";

import { buildCanonical, siteConfig, toAbsoluteUrl } from "./site";

type OgInput = {
  title: string;
  description: string;
  pathname: string;
  image?: string | null;
  type?: "website" | "article";
};

const resolveOgImage = (image?: string | null) => ({
  url: toAbsoluteUrl(image ?? siteConfig.defaultOg),
});

export const buildOpenGraph = ({
  title,
  description,
  pathname,
  image,
  type = "website",
}: OgInput): Metadata["openGraph"] => ({
  type,
  title,
  description,
  siteName: siteConfig.siteName,
  url: buildCanonical(pathname),
  images: [resolveOgImage(image)],
});

export const buildTwitter = ({
  title,
  description,
  image,
}: Pick<OgInput, "title" | "description" | "image">): Metadata["twitter"] => {
  const resolvedImage = image ? toAbsoluteUrl(image) : undefined;
  return {
    card: resolvedImage ? "summary_large_image" : "summary",
    title,
    description,
    images: resolvedImage ? [resolvedImage] : undefined,
  };
};

export const buildPageMetadata = ({
  title,
  description,
  pathname,
  image,
  type = "website",
}: OgInput): Metadata => ({
  title,
  description,
  alternates: {
    canonical: buildCanonical(pathname),
  },
  openGraph: buildOpenGraph({ title, description, pathname, image, type }),
  twitter: buildTwitter({ title, description, image }),
});
