"use client";

import * as React from "react";

import CurtainStage from "@/components/motion/CurtainStage";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";

type SearchCurtainProps = {
  swapKey: string;
  children: React.ReactNode;
};

export default function SearchCurtain({ swapKey, children }: SearchCurtainProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
    setActive(true);
    const duration = Math.max(220, motionTokens.durations.slow * 1000);
    const timer = window.setTimeout(() => setActive(false), duration);
    return () => window.clearTimeout(timer);
  }, [swapKey, reduced]);

  const primary = <div key={`primary-${swapKey}`}>{children}</div>;
  const secondary = <div key={`secondary-${swapKey}`}>{children}</div>;

  return <CurtainStage open={false} active={active} primary={primary} secondary={secondary} />;
}
