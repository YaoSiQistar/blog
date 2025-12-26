export type MarkdownFeatures = {
  toc: boolean;
  code: {
    highlight: boolean;
    lineNumbers: boolean;
    lineHighlight: boolean;
    titles: boolean;
    tabs: boolean;
    diff: boolean;
    fold: boolean;
  };
  callouts: boolean;
  math: boolean;
  mermaid: boolean;
  charts: boolean;
  citations: boolean;
  wikilinks: boolean;
  embeds: boolean;
  tables: boolean;
  csvTables: boolean;
  images: {
    lightbox: boolean;
    gallery: boolean;
    captions: boolean;
  };
  steps: boolean;
  reading: {
    progress: boolean;
    focusMode: boolean;
    printCSS: boolean;
  };
  searchIndex: boolean;
};

export type MarkdownFeatureOverrides = Partial<Omit<MarkdownFeatures, "code" | "images" | "reading">> & {
  code?: Partial<MarkdownFeatures["code"]>;
  images?: Partial<MarkdownFeatures["images"]>;
  reading?: Partial<MarkdownFeatures["reading"]>;
};

export type MarkdownPresetName = "minimal" | "blog" | "ultra";

const minimal: MarkdownFeatures = {
  toc: false,
  code: {
    highlight: false,
    lineNumbers: false,
    lineHighlight: false,
    titles: false,
    tabs: false,
    diff: false,
    fold: false,
  },
  callouts: false,
  math: false,
  mermaid: false,
  charts: false,
  citations: false,
  wikilinks: false,
  embeds: false,
  tables: true,
  csvTables: false,
  images: {
    lightbox: false,
    gallery: false,
    captions: false,
  },
  steps: false,
  reading: {
    progress: false,
    focusMode: false,
    printCSS: true,
  },
  searchIndex: false,
};

const blog: MarkdownFeatures = {
  toc: true,
  code: {
    highlight: true,
    lineNumbers: false,
    lineHighlight: true,
    titles: true,
    tabs: true,
    diff: true,
    fold: false,
  },
  callouts: true,
  math: true,
  mermaid: false,
  charts: false,
  citations: true,
  wikilinks: true,
  embeds: true,
  tables: true,
  csvTables: true,
  images: {
    lightbox: true,
    gallery: true,
    captions: true,
  },
  steps: true,
  reading: {
    progress: true,
    focusMode: true,
    printCSS: true,
  },
  searchIndex: true,
};

const ultra: MarkdownFeatures = {
  toc: true,
  code: {
    highlight: true,
    lineNumbers: true,
    lineHighlight: true,
    titles: true,
    tabs: true,
    diff: true,
    fold: false,
  },
  callouts: true,
  math: true,
  mermaid: true,
  charts: true,
  citations: true,
  wikilinks: true,
  embeds: true,
  tables: true,
  csvTables: true,
  images: {
    lightbox: true,
    gallery: true,
    captions: true,
  },
  steps: true,
  reading: {
    progress: true,
    focusMode: true,
    printCSS: true,
  },
  searchIndex: true,
};

export const markdownPresets: Record<MarkdownPresetName, MarkdownFeatures> = {
  minimal,
  blog,
  ultra,
};

const mergeCode = (base: MarkdownFeatures["code"], next?: Partial<MarkdownFeatures["code"]>) => ({
  ...base,
  ...(next ?? {}),
});

const mergeImages = (base: MarkdownFeatures["images"], next?: Partial<MarkdownFeatures["images"]>) => ({
  ...base,
  ...(next ?? {}),
});

const mergeReading = (base: MarkdownFeatures["reading"], next?: Partial<MarkdownFeatures["reading"]>) => ({
  ...base,
  ...(next ?? {}),
});

export function resolveMarkdownFeatures(
  preset: MarkdownPresetName = "blog",
  overrides?: MarkdownFeatureOverrides
): MarkdownFeatures {
  const base = markdownPresets[preset] ?? markdownPresets.blog;
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    code: mergeCode(base.code, overrides.code),
    images: mergeImages(base.images, overrides.images),
    reading: mergeReading(base.reading, overrides.reading),
  };
}

export const featureKeys = Object.keys(ultra) as Array<keyof MarkdownFeatures>;
