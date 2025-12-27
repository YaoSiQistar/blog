"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/reduced";

export type VariableFontHeroProps = {
  title: string;
  subtitle?: string;
  fontFamily?: string;
  weightRange?: [number, number];
  widthRange?: [number, number];
  className?: string;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isMobile;
};

export default function VariableFontHero({
  title,
  subtitle,
  fontFamily = "'Noto Serif SC', serif",
  weightRange = [300, 700],
  widthRange = [90, 110],
  className,
}: VariableFontHeroProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const reduced = prefersReduced || isMobile;
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const wght = useTransform(scrollYProgress, [0, 1], weightRange);
  const wdth = useTransform(scrollYProgress, [0, 1], widthRange);
  const fontSettings = useTransform([wght, wdth], ([weight, width]) =>
    `"wght" ${weight}, "wdth" ${width}`
  );

  return (
    <section ref={sectionRef} className={cn("space-y-4", className)}>
      <motion.h1
        style={{
          fontFamily,
          fontVariationSettings: reduced ? undefined : (fontSettings as unknown as string),
        }}
        className="text-4xl font-semibold leading-tight text-foreground md:text-6xl"
      >
        {title}
      </motion.h1>
      {subtitle ? <p className="max-w-2xl text-base text-muted-foreground">{subtitle}</p> : null}
    </section>
  );
}