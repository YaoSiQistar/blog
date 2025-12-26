import path from "path";
import { promises as fs } from "fs";

import Container from "@/components/shell/Container";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { ReadingPosition } from "@/components/markdown/ReadingPosition";
import { References } from "@/components/markdown/References";
import { parseHeadings } from "@/lib/markdown/parseHeadings";
import { resolveMarkdownFeatures, type MarkdownFeatureOverrides, type MarkdownFeatures, type MarkdownPresetName } from "@/lib/markdown/features";
import type { ReferenceEntry } from "@/lib/markdown/types";
import { getAllPostsIndex } from "@/lib/content";
import { cn } from "@/lib/utils";

import { MarkdownLabControls } from "./MarkdownLabControls";

const readBool = (value: string | string[] | undefined) => {
  if (value === "1") return true;
  if (value === "0") return false;
  return undefined;
};

const ensurePreset = (value: string | undefined): MarkdownPresetName => {
  if (value === "minimal" || value === "blog" || value === "ultra") return value;
  return "ultra";
};

const getOverride = (
  params: Record<string, string | string[] | undefined> | undefined,
  key: string
) => (params ? readBool(params[key]) : undefined);

const mergeOverrides = (
  params: Record<string, string | string[] | undefined> | undefined
): MarkdownFeatureOverrides => {
  const overrides: MarkdownFeatureOverrides = {};
  const code: Partial<MarkdownFeatures["code"]> = {};
  const images: Partial<MarkdownFeatures["images"]> = {};
  const reading: Partial<MarkdownFeatures["reading"]> = {};

  const set = <T extends object, K extends keyof T>(target: T, key: K, value: boolean | undefined) => {
    if (value === undefined) return;
    target[key] = value as T[K];
  };

  set(overrides, "toc", getOverride(params, "toc"));
  set(overrides, "callouts", getOverride(params, "callouts"));
  set(overrides, "math", getOverride(params, "math"));
  set(overrides, "mermaid", getOverride(params, "mermaid"));
  set(overrides, "charts", getOverride(params, "charts"));
  set(overrides, "citations", getOverride(params, "citations"));
  set(overrides, "wikilinks", getOverride(params, "wikilinks"));
  set(overrides, "embeds", getOverride(params, "embeds"));
  set(overrides, "tables", getOverride(params, "tables"));
  set(overrides, "csvTables", getOverride(params, "csvTables"));
  set(overrides, "steps", getOverride(params, "steps"));

  set(code, "highlight", getOverride(params, "codeHighlight"));
  set(code, "lineNumbers", getOverride(params, "codeLineNumbers"));
  set(code, "lineHighlight", getOverride(params, "codeLineHighlight"));
  set(code, "titles", getOverride(params, "codeTitles"));
  set(code, "tabs", getOverride(params, "codeTabs"));
  set(code, "diff", getOverride(params, "codeDiff"));

  set(images, "lightbox", getOverride(params, "imageLightbox"));
  set(images, "gallery", getOverride(params, "imageGallery"));
  set(images, "captions", getOverride(params, "imageCaptions"));

  set(reading, "progress", getOverride(params, "readingProgress"));
  set(reading, "focusMode", getOverride(params, "focusMode"));
  set(reading, "printCSS", getOverride(params, "printCSS"));

  if (Object.keys(code).length) overrides.code = code;
  if (Object.keys(images).length) overrides.images = images;
  if (Object.keys(reading).length) overrides.reading = reading;

  return overrides;
};

const estimateReadingTime = (content: string) => {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 360));
};

interface MarkdownLabPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MarkdownLabPage({ searchParams }: MarkdownLabPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const preset = ensurePreset(params?.preset as string | undefined);
  const overrides = mergeOverrides(params);
  const features = resolveMarkdownFeatures(preset, overrides);

  const demoPath = path.join(process.cwd(), "content", "_demos", "ultra.md");
  const refsPath = path.join(process.cwd(), "content", "_demos", "refs.json");

  const [markdown, refsRaw, postIndex] = await Promise.all([
    fs.readFile(demoPath, "utf8"),
    fs.readFile(refsPath, "utf8"),
    getAllPostsIndex({ includeDrafts: true }),
  ]);

  let references: ReferenceEntry[] = [];
  try {
    references = JSON.parse(refsRaw) as ReferenceEntry[];
  } catch {
    references = [];
  }

  const headings = parseHeadings(markdown);
  const readingTime = estimateReadingTime(markdown);

  return (
    <main className="space-y-(--section-y) py-(--section-y)">
      <Container variant="wide" className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-serif font-semibold text-foreground">Markdown Lab</h1>
          <p className="text-muted-foreground">
            A publication-grade Markdown renderer with toggles, references, diagrams, and data-ready blocks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-border/70 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            {readingTime} min read
          </div>
          <ReadingPosition targetId="markdown-lab-article" />
        </div>
        <MarkdownLabControls preset={preset} features={features} />
      </Container>

      {features.reading.progress ? <ReadingProgress targetId="markdown-lab-article" /> : null}

      <Container variant="wide">
        <div
          className={cn(
            "grid gap-10",
            features.reading.focusMode
              ? "grid-cols-1"
              : "lg:grid-cols-[minmax(0,1fr)_320px]"
          )}
        >
          <section className="space-y-10">
            <MarkdownRenderer
              markdown={markdown}
              id="markdown-lab-article"
              features={features}
              references={references}
              postIndex={postIndex}
              paragraphAnchors
            />
          </section>

          {!features.reading.focusMode ? (
            <aside className="markdown-lab-aside space-y-6">
              <TableOfContents headings={headings} />
              <div className="rounded-(--radius) border border-border/70 bg-card/60 p-4 text-sm text-muted-foreground">
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.32em]">Outline</div>
                <div className="mt-2">{headings.length} headings - H2/H3/H4</div>
                {features.citations ? (
                  <>
                    <div className="mt-4 text-xs uppercase tracking-[0.3em]">References</div>
                    <div className="mt-2 space-y-1">
                      {references.slice(0, 4).map((entry) => (
                        <a key={entry.id} href={`#ref-${entry.id}`} className="block text-xs text-muted-foreground">
                          {entry.title}
                        </a>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>
      </Container>

      <Container variant="wide">
        <div className="space-y-6">
          {features.citations ? <References references={references} /> : null}
          <div className="rounded-[var(--radius)] border border-border/70 bg-card/60 p-4">
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Feature Debug
            </div>
            <pre className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground">
              {JSON.stringify(features, null, 2)}
            </pre>
          </div>
        </div>
      </Container>
    </main>
  );
}
