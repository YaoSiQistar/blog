export const KintsugRailTokens = {
  dimension: {
    width: "240px",
    minWidth: "210px",
    maxWidth: "260px",
    compact: {
      width: "180px",
      minWidth: "160px",
      maxWidth: "200px",
    },
    lineStroke: 1.35,
    nodeRadius: {
      default: 4,
      active: 7,
      sub: 3,
    },
    minNodeGap: 14,
  },
  colors: {
    line: "var(--color-border)",
    lineHighlight: "var(--color-primary)",
    node: "var(--color-muted-foreground)",
    nodeActive: "var(--color-foreground)",
    nodeVisited: "var(--color-muted)",
    label: "var(--color-foreground)",
    labelMuted: "var(--color-muted-foreground)",
  },
  typography: {
    label: "text-[0.7rem] leading-snug tracking-[0.18em] font-serif",
    activeLabel: "font-semibold tracking-[0.12em]",
  },
};
