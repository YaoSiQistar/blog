---
title: "Editorial Markdown Showcase"
date: "2025-12-30"
slug: "markdown-showcase"
category: "system"
tags: ["markdown", "spec", "demo"]
excerpt: "Every markdown capability we support, rendered with the warm-paper aesthetic."
draft: false
cover: "/images/cover-markdown-showcase.jpg"
---

# Markdown Showcase

Welcome to the editorial stage—this document runs through _every supported block_ so the renderer feels production-ready.

## Typographic Hierarchy

### Heading variations
1. Heading One (H1, top level)
2. Heading Two (H2, section)
3. Heading Three (H3, subsection)

### Blockquote with attribution
> “Motion is the punctuation of stillness.”  
> — Editorial Motion Archive

## Lists & Checkboxes

- [x] Gather quotes
- [ ] Frame hierarchy
- [ ] Share layout

- Item with **bold**, _italic_, and `inline code`
- Another item with a link to [the archive](/posts)

## Tables & Grid

| Layer | Description | Detail |
| --- | --- | --- |
| Header | Serif, 2.5rem | Spaced |
| Body | 72ch, leading 1.85 | Warm |
| Margins | 48px | Rhythm |

## Code of motion

```ts title="components/motion/InkLayer.tsx"
export const InkLayer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/80">
    {children}
  </div>
);
```

```bash
pnpm lint
```

## Image & Caption

![Warm editorial board](https://images.unsplash.com/photo-1498050108023-c5249f4df085 "Studio paper desk")
*Figure: A desk that smells faintly of tea and graphite.*

## Footnotes & Links

Refer back to the [heading hierarchy](#typographic-hierarchy) before turning the page.[^1]

[^1]: These footnotes are handled by `remark-footnotes` and styled like editorial annotations with dimmed numbering.

## Mixed Semantic Blocks

### Quote + paragraph
Sometimes a quote introduces the context:
> Notes on motion require the patience of a slow typewriter.

Continue with a paragraph that emulates magazine prose, laced with [internal anchors](#markdown-showcase) and `inline code`.

### Image list
- ![Ink strokes](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee "Ink Strokes") *Ink on paper*
- ![Gallery light](https://images.unsplash.com/photo-1469474968028-56623f02e42e "Gallery Light") *Light study*

## Closing

Thank you for scrolling. Share this URL to sync your guide rail and Markdown renderer configuration.
