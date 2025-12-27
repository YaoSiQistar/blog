const toCssEasing = (value: readonly [number, number, number, number]) =>
  `cubic-bezier(${value.join(",")})`;

export const motionTokens = {
  durations: {
    fast: 0.18,
    normal: 0.26,
    slow: 0.34,
    cinematic: 0.9,
    cinema: 0.9,
  },
  easing: {
    easeOut: [0.22, 1, 0.36, 1] as const,
    anticipate: [0.18, 1.12, 0.24, 1] as const,
  },
  limits: {
    yMax: 12,
    scaleMax: 0.04,
    rotateMax: 8,
    blurMax: 8,
    perspective: 1200,
    staggerMax: 12,
    enterY: 12,
    hoverY: 3,
    magnetic: 8,
    blur: 2,
    stagger: 0.05,
  },
  transition: {
    exit: 0.18,
    interlude: 0.15,
    enter: 0.32,
    y: 0,
    blur: 1.2,
    filmBlur: 1.3,
    filmOpacity: 0.22,
    filmBorder: "rgba(19, 21, 32, 0.35)",
    filmBorderTransparent: "rgba(19, 21, 32, 0)",
    filmTint: "rgba(252, 248, 238, 0.85)",
    filmTintTransparent: "rgba(252, 248, 238, 0)",
    inkOpacity: 0.18,
    inkSpread: 60,
    inkColor: "rgba(24, 20, 16, 0.18)",
  },
  ultra: {
    lightUpDuration: 0.12,
    inkDuration: 0.48,
    titleRevealDelay: 0.36,
    titleRevealDuration: 0.54,
    ctaDelay: 0.82,
    lineDrawDelay: 0.98,
    lineDrawDuration: 0.42,
    sheenOpacityCinemaBoost: 0.04,
    inkOpacityCinemaBoost: 0.03,
  },
  hover: {
    sheenOpacity: 0.1,
    sheenDuration: 0.26,
    sheenEase: [0.22, 1, 0.36, 1] as const,
  },
  underline: {
    thickness: 1.25,
    offset: -2,
  },
  header: {
    threshold: 48,
    blur: 12,
    tintLight: "rgba(255, 255, 255, 0.92)",
    tintDark: "rgba(24, 26, 34, 0.8)",
  },
  css: {
    focusRing: "cubic-bezier(0.22,1,0.36,1)",
  },
  toCssEasing,
};

export type MotionTokens = typeof motionTokens;
