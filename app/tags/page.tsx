import Container from "@/components/shell/Container";
import { RuleLine } from "@/components/editorial/RuleLine";
import Kicker from "@/components/editorial/Kicker";
import KintsugiTopicRail from "@/components/tags/KintsugiTopicRail";
import TagsSections, { TagSection } from "@/components/tags/TagsSections";
import VariableFontHero from "@/components/motion/VariableFontHero";
import { getAllTags, getHotTags } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/og";

export const metadata = buildPageMetadata({
  title: "Tags",
  description: "Browse tags across the archive index.",
  pathname: "/tags",
});

interface TagsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const isAlpha = (value: string) => /^[A-Z]$/.test(value);

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const resolvedSearchParams = await searchParams;
  const tags = await getAllTags();
  const useAlphabet = tags.length >= 40;
  const hotTags = useAlphabet ? [] : await getHotTags();
  let sections: TagSection[] = [];

  if (useAlphabet) {
    const grouped = new Map<string, typeof tags>();
    tags.forEach((tag) => {
      const letter = tag.slug.charAt(0).toUpperCase();
      const key = isAlpha(letter) ? letter : "#";
      const next = grouped.get(key) ?? [];
      next.push(tag);
      grouped.set(key, next);
    });

    const letters = Array.from(grouped.keys()).sort((a, b) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    });

    sections = letters.map((letter) => {
      const groupedTags = grouped.get(letter) ?? [];
      const ordered = [...groupedTags].sort((a, b) => a.slug.localeCompare(b.slug));
      return {
        id: `sec-${letter}`,
        title: letter,
        tags: ordered,
        meta: {
          countLabel: `${ordered.length} tags`,
        },
      };
    });
  } else {
    const popularSource = hotTags.length > 0 ? hotTags : tags;
    const popular = popularSource.slice(0, 12);
    sections = [
      {
        id: "sec-popular",
        title: "Popular",
        tags: popular,
        meta: {
          countLabel: `${popular.length} tags`,
        },
      },
      {
        id: "sec-all",
        title: "All",
        tags,
        meta: {
          countLabel: `${tags.length} tags`,
        },
      },
      {
        id: "sec-end",
        title: "End",
        tags: [],
        meta: {
          note: "You have reached the end of the tag wall.",
        },
      },
    ];
  }

  const railSections = sections.map((section) => ({
    id: section.id,
    label: section.title,
    count: section.tags.length,
  }));

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <VariableFontHero
          title="Tag Atlas"
          subtitle="Scan themes across the editorial archive."
          weightRange={[320, 720]}
          widthRange={[92, 110]}
        />
        <RuleLine />
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] border border-border bg-card/70 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <Kicker label="Catalog" caption="Tags" />
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              {tags.length} tags
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
            Mode - {useAlphabet ? "Alphabet" : "Curated"}
          </span>
        </div>
      </Container>

      <Container variant="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div id="tags-root" className="min-w-0 space-y-10">
            <TagsSections sections={sections} />
          </div>
          <aside className="space-y-6">
            <div className="lg:sticky lg:top-[6.75rem]">
              <KintsugiTopicRail
                sections={railSections}
                containerSelector="#tags-root"
                sectionSelector="[data-topic-section]"
              />
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
