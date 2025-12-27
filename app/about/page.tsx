import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import AboutHero from "@/components/about/AboutHero";
import AboutLead from "@/components/about/AboutLead";
import AboutHighlights from "@/components/about/AboutHighlights";
import AboutFAQ from "@/components/about/AboutFAQ";
import AboutCTAs from "@/components/about/AboutCTAs";
import AboutTOC from "@/components/about/AboutTOC";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { parseHeadings } from "@/lib/markdown/parseHeadings";
import { getAboutPage } from "@/lib/pages/getPage";
import { buildPageMetadata } from "@/lib/seo/og";
import SequenceScrub from "@/components/motion/SequenceScrub";

const extractLead = (content: string) => {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0 && !paragraph.startsWith("#"));
  return paragraphs.slice(0, 3);
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  if (!page) return {};

  const description =
    page.frontmatter.subtitle || page.frontmatter.lead?.[0] || "关于编辑者。";

  return buildPageMetadata({
    title: page.frontmatter.title || "关于",
    description,
    pathname: "/about",
  });
}

export default async function AboutPage() {
  const page = await getAboutPage();
  if (!page) notFound();

  const { frontmatter, content, wordCount } = page;
  const sequenceFrames = Array.from({ length: 14 }, (_, i) => `/sequence/about/frame-${String(i + 1).padStart(3, "0")}.webp`);
  const headings = parseHeadings(content);
  const showToc = wordCount > 1200 && headings.length > 0;
  const lead = frontmatter.lead?.length ? frontmatter.lead : extractLead(content);

  return (
    <main className="relative  pt-(--section-y) ">
      <KintsugiGate />
      <PaperAtmosphere />
      <Container variant="wide" className="space-y-12">
        <AboutHero
          title={frontmatter.title}
          subtitle={frontmatter.subtitle}
          name={frontmatter.name}
          avatar={frontmatter.avatar}
          role={frontmatter.role}
          location={frontmatter.location}
          now={frontmatter.now}
          email={frontmatter.email}
          links={frontmatter.links}
        />

        <AboutLead lead={lead} highlights={frontmatter.highlights} />

        <section className="space-y-4">
          <SequenceScrub frames={sequenceFrames} heightVh={160} />
        </section>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="max-w-[72ch] space-y-6">
            <MarkdownRenderer markdown={content} features="ultra" contentPath={page.sourcePath} />
          </div>
          {showToc ? (
            <aside className="space-y-6">
              <AboutTOC headings={headings} />
            </aside>
          ) : null}
        </section>

        <AboutHighlights items={frontmatter.highlights ?? []} />

        <AboutFAQ items={frontmatter.faq ?? []} />

        <AboutCTAs
          primary={frontmatter.cta?.primary}
          secondary={frontmatter.cta?.secondary}
          tertiary={frontmatter.cta?.tertiary}
        />
      </Container>
    </main>
  );
}


