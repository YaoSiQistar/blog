# Guide Rail System

## 1. System Goals & Modes
- **Index Rail (mode="index")**: anchors category sections, alphabet groups, pagination controls, and keeps the line synced to the active section via IntersectionObserver.
- **Reading Rail (mode="reading")**: mirrors article headings (H2/H3) with nodes, highlights the active chapter, and surfaces a reading progress fraction.
- **Hero Rail (mode="hero")**: ties modules (Hero, Latest, Galleries, End) to the golden Kintsugi stroke so the rail narrates the home journey.
- All modes share the same rail language (line, nodes, labels, tooltips, HUD) even if semantics differ.

## 2. Visual Tokens
- **Dimensions** (see `components/guide/tokens.ts`): width locked to 220–260px, line stroke 1px, node radii 3px normal / 5.5px active / 2px for level-2 nodes, min gap 10px.
- **Colors**: line colors reuse shadcn CSS vars (`var(--color-border)` / `var(--color-foreground)`), nodes draw from primary/foreground/muted tones, hover/visited/disabled variations come from existing keywords.
- **Typography**: labels use `text-[0.65rem] leading-tight tracking-[0.28em]` and active labels add `font-semibold` for contrast.
- **Glass treatment**: the entire rail can show a `bg-background/20` + `backdrop-blur-sm` envelope when `?cinema=1`, otherwise it stays minimal.

## 3. Interaction Grammar
- States: every node exposes `data-state` (default, hover, active, visited, disabled), and hover only tweaks opacity.
- Click behavior: `useGuideNavigate()` smooth-scrolls scroll targets or pushes route targets while applying a 320ms `data-guide-highlight` envelope to the target.
- Highlight rules: `useGuideActive()` uses IntersectionObserver with `rootMargin: -20% 0px -60% 0px` so the foremost intersecting element controls `activeId`.
- Tooltips: nodes surface `meta.subtitle` via `title` text (e.g., "Chapter 3 · Typography"), and `GuideList` repeats the info if needed.

## 4. Motion Grammar
- Entry: the rail draws the line on mount with Framer Motion (short durations, no springs) and nodes stagger lightly in the first frame.
- States: active nodes animate scale/opacities in 120–180ms, hover only adjusts opacity in 80–120ms, and the progress bar animates with `motionTokens.durations.normal` + `motionTokens.easing.easeOut`.
- Reduced motion: `useReducedMotionGate()` checks `prefers-reduced-motion` plus `?reduced=1`, and when true the path draw/progress uses zero duration and hero path renders as solid.

## 5. Data Model
```
export type GuideNode = {
  id: string;
  label: string;
  kind: "section" | "heading" | "page" | "module";
  level?: 1 | 2;
  target: {
    type: "scroll" | "route";
    selector?: string;
    href?: string;
  };
  meta?: {
    count?: number;
    subtitle?: string;
    visited?: boolean;
    disabled?: boolean;
  };
};
export type GuideRailState = {
  activeId?: string;
  progress: number;
  mode: "index" | "reading" | "hero";
};
```

## 6. Hooks & Pseudocode
- `useGuideProgress(containerSelector?)`: clamps document or container scroll into a `0..1` progress value with RAF and resize listeners.
- `useGuideActive(nodes, options?)`: observes only scroll selectors, tags each target with `data-guide-id`, and sets `activeId` to whichever intersecting element sits closest to the viewport top.
- `useGuideMap(nodes, { railRef, mode, minSpacing })`: measures the rail height, maps DOM offsets (or falls back to even spacing), and returns `mappedNodes` + `railHeight` for the axis.
- `useGuideNavigate()`: scrolls via `scrollIntoView` or pushes routes; the highlighted target gets a `data-guide-highlight` dataset toggle for 320ms.
- `useReducedMotionGate()`: merges `prefers-reduced-motion` with `?reduced=1`/`?cinema=1`/`?debug=1`, producing `{ isReduced, debug, allowCinema }` for the components.

## 7. Component Library
| Component | Responsibility |
| --- | --- |
| `GuideRail` | Shell that wires progress, active state, axis, list, utilities, HUD, and `debug` flags. It also positions the axis next to the primary content without causing CLS.
| `GuideAxis` | Draws the base line, highlight, interactive nodes, and, in `hero` mode, the Kintsugi path so the single rail owns both the golden stroke and the clickable dots while reusing the shared `progress`/`mode` state.
| `GuideList` | Optional text-first list that mirrors node states, surfaces subtitles/counts, and shares the `goTo` handler.
| `GuideHUD` | Debug overlay (visible via prop or `?debug=1`) showing mode, active node, percent, rail height, and mapped positions for QA.
| `guideRailTokens` | CSS tokens for dimensions, colors, and typography that reuse shadcn CSS vars.

## 8. Page Integration Examples
### /posts (Index Rail)
```
const nodes: GuideNode[] = [
  { id: "sec-featured", label: "Featured", kind: "section", target: { type: "scroll", selector: "#sec-featured" }, meta: { subtitle: "Latest" } },
  { id: "sec-category-design", label: "Design", kind: "section", target: { type: "scroll", selector: "#sec-category-design" }, meta: { subtitle: "Category" } },
  { id: "page-2", label: "Page 2", kind: "page", target: { type: "route", href: "/posts?page=2" }, meta: { subtitle: "Go deeper" } },
];
<GuideRail nodes={nodes} mode="index" containerSelector="#posts-root" />
```
### /tags (Index Rail, alphabet)
```
const nodes = alphaSections.map((letter) => ({
  id: `sec-${letter}`,
  label: letter,
  kind: "section",
  target: { type: "scroll", selector: `#sec-${letter}` },
  meta: { subtitle: `${letter} · ${tagCounts[letter] ?? 0} tags` },
}));
```
### /posts/[slug] (Reading Rail)
```
const nodes = headings.map(({ id, text, level }) => ({
  id: `heading-${id}`,
  label: text,
  kind: "heading",
  level: level === 3 ? 2 : 1,
  target: { type: "scroll", selector: `#${id}` },
  meta: { subtitle: level === 2 ? `Section ${text}` : undefined },
}));
<GuideRail nodes={nodes} mode="reading" containerSelector="article" />
```
### / (Hero Rail)
```
const nodes = [
  { id: "module-hero", label: "Hero", kind: "module", target: { type: "scroll", selector: "#hero" } },
  { id: "module-latest", label: "Latest", kind: "module", target: { type: "scroll", selector: "#latest" } },
  { id: "module-galleries", label: "Galleries", kind: "module", target: { type: "scroll", selector: "#galleries" } },
  { id: "module-footer", label: "Curator note", kind: "module", target: { type: "scroll", selector: "#footer" } },
];
<GuideRail nodes={nodes} mode="hero" containerSelector="#home-content" />
```

## 9. File List
- `lib/guide-rail/types.ts`: shared `GuideNode`/`GuideRailState` typings.
- `hooks/guideRail.ts`: reusable hooks (`useGuideProgress`, `useGuideActive`, `useGuideMap`, `useGuideNavigate`, `useReducedMotionGate`, `useGuideRailFlags`).
- `components/guide/GuideRail.tsx`: orchestrator with header, axis, list, utilities, and HUD.
- `components/guide/GuideAxis.tsx`: axis rendering with hero path + node states and highlight.
- `components/guide/GuideList.tsx`: textual list states + CTA buttons.
- `components/guide/GuideHUD.tsx`: debug panel triggered by `?debug=1`.
- `components/guide/tokens.ts`: design tokens referencing shadcn CSS vars.
- `app/globals.css`: highlight styles for `data-guide-highlight`.
- `app/page.tsx`: home wiring of `GuideRail` with hero nodes.

## 10. Acceptance Checklist
- [ ] `/posts`, `/tags`, `/posts/[slug]`, and `/` share the same GuideRail look/feel (line, nodes, list).
- [ ] Active highlighting uses IntersectionObserver and keeps progress at 0-100%.
- [ ] Node clicks call `useGuideNavigate()` and apply the `data-guide-highlight` feedback.
- [ ] Progress bar animates consistently, and `?reduced=1`/`prefers-reduced-motion` disables motion.
- [ ] `?debug=1` surfaces `GuideHUD` with the expected data.
- [ ] Rail stays out of the main content flow and does not cause CLS.
- [ ] Documentation traces the files, tokens, hooks, and hero path integration.
