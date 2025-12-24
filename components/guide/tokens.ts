export const guideRailTokens = {
  dimension: {
    width: "240px",
    minWidth: "220px",
    maxWidth: "260px",
    lineStroke: 1,
    nodeRadius: {
      default: 3,
      active: 5.5,
      sub: 2,
    },
    minNodeGap: 10,
  },
  colors: {
    line: "var(--color-border)",
    lineHighlight: "var(--color-foreground)",
    node: "var(--color-muted-foreground)",
    nodeActive: "var(--color-foreground)",
    nodeVisited: "var(--color-muted)",
    label: "var(--color-foreground)",
    labelMuted: "var(--color-muted-foreground)",
  },
  typography: {
    label: "text-[0.65rem] leading-tight tracking-[0.28em] font-normal",
    activeLabel: "font-semibold tracking-[0.25em]",
  },
};
