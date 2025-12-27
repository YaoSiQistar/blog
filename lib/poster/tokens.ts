export const posterTokens = {
  sizes: {
    posterMaxWidth: "84ch",
    posterAspect: "16 / 10",
    ogSize: { width: 1200, height: 630 },
  },
  type: {
    title: { fontSize: "2.75rem", lineHeight: 1.12, letterSpacing: "-0.01em" },
    excerpt: { fontSize: "1.05rem", lineHeight: 1.6, letterSpacing: "0.01em" },
    meta: { fontSize: "0.68rem", lineHeight: 1.4, letterSpacing: "0.28em" },
    tag: { fontSize: "0.6rem", lineHeight: 1.4, letterSpacing: "0.28em" },
  },
  spacing: {
    padding: "2.5rem",
    gap: "1.5rem",
    baseline: "0.5rem",
  },
  hairline: {
    thickness: "1px",
    opacity: 0.45,
  },
  grain: {
    minOpacity: 0.04,
    maxOpacity: 0.08,
  },
  colors: {
    paper: "#FAFAF9",
    ink: "#111827",
    muted: "#6B7280",
    hairline: "#E5E7EB",
    accent: "#1E3A8A",
    accentSoft: "rgba(30,58,138,0.18)",
  },
} as const;

export type PosterTemplate = "plain" | "a" | "b";

export const posterShareTokens = {
  colors: {
    paper: "#FAFAF9",
    ink: "#111827",
    muted: "#6B7280",
    hairline: "#E5E7EB",
    accent: "#1E3A8A",
    accentSoft: "rgba(30,58,138,0.16)",
    inkMono: "#0B0F1A",
  },
  type: {
    title: { fontSize: 58, lineHeight: 1.08 },
    excerpt: { fontSize: 22, lineHeight: 1.5 },
    meta: { fontSize: 14, letterSpacing: "0.28em" },
    tag: { fontSize: 12, letterSpacing: "0.25em" },
  },
  spacing: {
    padding: 64,
    gap: 24,
  },
  grain: {
    opacity: 0.06,
  },
} as const;
