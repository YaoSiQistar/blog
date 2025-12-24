"use client";

import * as React from "react";
import { motion } from "motion/react";

import Container from "@/components/shell/Container";
import RevealTextMask from "@/components/motion/RevealTextMask";
import ScrollDirector from "@/components/motion/ScrollDirector";
import Magnetic from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/button";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

export default function HomeHeroUltra() {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;
  const cinemaFactor = flags.cinema ? 1.15 : 1;
  const [lineReady, setLineReady] = React.useState(false);

  return (
    <section id="hero" data-section="hero" ref={heroRef} className="relative pt-28 pb-20">
      <Container variant="wide">
        <ScrollDirector
          scrollTarget={heroRef}
          range={[0, 0.35]}
          config={{
            y: [0, -12],
            opacity: [1, 0.88],
            blur: [0, 1.8],
            scale: [1, 0.98],
            lineScale: [1, 0.55],
          }}
        >
          {({ y, opacity, blurFilter, scale }) => (
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <motion.div
                style={{
                  translateY: y,
                  opacity,
                  scale,
                  filter: blurFilter,
                }}
                className="space-y-6"
              >
                <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Museum Editorial Archive
                </div>
                <RevealTextMask
                  text="A quiet catalog of ink, paper, and motion."
                  className="text-4xl font-semibold leading-tight md:text-5xl"
                  delay={motionTokens.ultra.titleRevealDelay * cinemaFactor}
                />
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={reduced ? false : { opacity: 1, y: 0 }}
                  transition={{
                    delay: motionTokens.ultra.titleRevealDelay + 0.2,
                    duration: motionTokens.durations.normal * cinemaFactor,
                    ease: motionTokens.easing.easeOut,
                  }}
                  className="max-w-xl text-base text-muted-foreground"
                >
                  An editorial space for warm paper stories, cinematic motion notes,
                  and curated research. The archive is written in Markdown and
                  arranged like a gallery wall.
                </motion.p>
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={reduced ? false : { opacity: 1, y: 0 }}
                  transition={{
                    delay: motionTokens.ultra.ctaDelay,
                    duration: motionTokens.durations.normal * cinemaFactor,
                    ease: motionTokens.easing.easeOut,
                  }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <Magnetic className="inline-flex">
                    <Button variant="default">Enter the archive</Button>
                  </Magnetic>
                  <Button variant="secondary">View catalog</Button>
                </motion.div>
              </motion.div>

              <motion.aside
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={reduced ? false : { opacity: 1, y: 0 }}
                transition={{
                  delay: motionTokens.ultra.titleRevealDelay + 0.4,
                  duration: motionTokens.durations.normal * cinemaFactor,
                  ease: motionTokens.easing.easeOut,
                }}
                className={cn(
                  "rounded-[var(--radius)] border border-border bg-card/70 p-6 text-sm text-muted-foreground",
                  "space-y-4"
                )}
              >
                <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
                  Exhibition Label
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Collection</span>
                    <span className="text-foreground">Edition 01</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span className="text-foreground">Studio Archive</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Index</span>
                    <span className="text-foreground">2025-ULTRA</span>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}
        </ScrollDirector>

        <ScrollDirector scrollTarget={heroRef} range={[0, 0.35]}>
          {({ lineScale }) => (
            <motion.div
              className="mt-12 h-px w-full origin-left bg-border/70"
              style={lineReady && !reduced ? { scaleX: lineScale } : undefined}
              initial={reduced ? false : { scaleX: 0 }}
              animate={reduced ? false : { scaleX: 1 }}
              transition={{
                delay: motionTokens.ultra.lineDrawDelay,
                duration: motionTokens.ultra.lineDrawDuration * cinemaFactor,
                ease: motionTokens.easing.easeOut,
              }}
              onAnimationComplete={() => setLineReady(true)}
            />
          )}
        </ScrollDirector>
      </Container>
    </section>
  );
}
