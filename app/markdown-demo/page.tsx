import Container from "@/components/shell/Container";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ReadingProgress } from "@/components/markdown/ReadingProgress";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { parseHeadings } from "@/lib/markdown/parseHeadings";

const demoMarkdown = `
## Editorial Warm-Up

Like a curator arranging a show, the editorial mindset curates meaning before form.

### Signal / Noise

- [x] Gather references
- [ ] Sketch hierarchy
- [ ] Approve spread

## Motion Study

Motion passes through restraint, letting the warm paper insist on calm.

### Layering

1. Frame the story
2. Ink the paths
3. Let the reader wander

> “A thoughtful pace is often the most urgent.” — Editorial Note

## Cabinet of Code

Here is a TypeScript snippet that styles a marquee section:

\`\`\`ts title="components/marquee.ts"
const marquee = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80">
      {children}
    </div>
  );
};
\`\`\`

And a quick bash command to clean/install:

\`\`\`bash
pnpm run lint
\`\`\`

## Table of Notes

| Layer | Description |
| --- | --- |
| Header | Serif, spacious, 72ch |
| Body | 1.85 leading, calm |

## Images & References

![Warm editorial board](https://images.unsplash.com/photo-1498050108023-c5249f4df085 "Studio paper desk")

## Anchors & Footnotes

Learn more in the sections above and revisit the [editorial warm-up](#editorial-warm-up).

Here are footnotes[^1] and another thought[^2].

[^1]: Footnote one explains the context.
[^2]: Footnote two extends the metaphor.
`;

export default function MarkdownDemoPage() {
  const headings = parseHeadings(demoMarkdown);
  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-semibold text-foreground">
            Markdown Demo
          </h1>
          <p className="text-muted-foreground">
            Showcase of the full editorial Markdown renderer, TOC, and progress system.
          </p>
        </div>
      </Container>

      <ReadingProgress targetId="markdown-demo-article" />

      <Container variant="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-10">
            <section id="markdown-demo-article">
              <MarkdownRenderer markdown={demoMarkdown} />
            </section>
          </div>
          <aside className="space-y-6">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </Container>
    </main>
  );
}
