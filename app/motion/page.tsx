"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import Container from "@/components/shell/Container";
import PageHeader from "@/components/shell/PageHeader";
import { RuleLine } from "@/components/editorial/RuleLine";
import Kicker from "@/components/editorial/Kicker";
import RevealTextMask from "@/components/motion/RevealTextMask";
import SheenHover from "@/components/motion/SheenHover";
import Magnetic from "@/components/motion/Magnetic";
import ScrollDirector from "@/components/motion/ScrollDirector";
import { motionTokens } from "@/lib/motion/tokens";
import { postTitleId, postCoverId, postMetaId } from "@/lib/motion/ids";
import { staggerContainer, staggerItem, lineDraw } from "@/lib/motion/variants";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/motion/reduced";

const staggerSamples = Array.from({ length: 8 }, (_, index) => ({
  id: `motion-${index}`,
  label: `Stamp ${index + 1}`,
}));

export default function MotionPage() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide">
        <PageHeader
          label="Motion system"
          title="Orchestrated transitions for editorial spaces"
          description="Tokens, primitives, shared layouts, and scroll director utilities prove out the cinematic rhythm."
        />

        <RuleLine className="mb-8" />

        <section className="grid gap-4 md:grid-cols-2">
          <article className="space-y-3 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Tokens" caption="Timing" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              All motion is driven by shared tokens so the durations, easing, and limits stay centralized for consistent direction.
            </p>
            <div className="grid gap-2 text-[0.8rem]">
              {Object.entries(motionTokens.durations).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="uppercase tracking-[0.3em] text-muted-foreground/80">{label}</span>
                  <span>{value}s</span>
                </div>
              ))}
            </div>
          </article>
          <article className="space-y-3 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Limits" caption="Cadence" />
            <div className="grid gap-2 text-[0.8rem]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground/80">enter y</span>
                <span>{motionTokens.limits.enterY}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground/80">hover y</span>
                <span>{motionTokens.limits.hoverY}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground/80">magnetic</span>
                <span>{motionTokens.limits.magnetic}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground/80">blur cap</span>
                <span>{motionTokens.limits.blur}px</span>
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="space-y-3 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Mask reveal" caption="titles" />
            <RevealTextMask
              text="Warm paper titles float into view."
              className="text-3xl font-semibold"
            />
            <RevealTextMask
              text="词 / words 也能优雅展开。"
              mode="words"
              className="text-lg leading-relaxed"
            />
          </article>

          <article className="space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="sheen + magnetic" caption="cta" />
            <SheenHover className="block">
              <Button className="w-full" variant="secondary">
                Sheen ready
              </Button>
            </SheenHover>
            <Magnetic className="inline-flex">
              <Button variant="default">Magnetic CTA</Button>
            </Magnetic>
          </article>
        </section>

        <section className="space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-6">
          <Kicker label="Stagger" caption="Catalog" />
          <motion.div
            variants={staggerContainer(reduced)}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2"
          >
            {staggerSamples.map((item) => (
              <motion.div
                key={item.id}
                variants={staggerItem(reduced)}
                className="rounded-xl border border-border bg-card/80 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  {item.id}
                </p>
                <p className="text-lg font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section
          ref={heroRef}
          className="relative space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-6"
        >
          <Kicker label="Scroll director" caption="Hero" />
          <ScrollDirector scrollTarget={heroRef} range={[0, 0.35]}>
            {({ y, opacity, blurFilter, scale }) => (
              <motion.div
                style={{
                  translateY: y,
                  opacity,
                  scale,
                  filter: blurFilter,
                }}
                className="rounded-[var(--radius)] border border-border-subtle bg-card/80 p-6"
              >
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                  Scroll-driven hero
                </p>
                <p className="text-3xl font-semibold text-foreground">
                  Controlled gravity, no surprise.
                </p>
              </motion.div>
            )}
          </ScrollDirector>
          <motion.svg
            viewBox="0 0 120 60"
            className="h-12 w-full"
            role="presentation"
          >
            <motion.path
              d="M10 30 H110"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              variants={lineDraw(reduced)}
              initial="hidden"
              animate="visible"
            />
          </motion.svg>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="space-y-2 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Shared layout" caption="story" />
            <motion.div
              layoutId={postTitleId("aurora")}
              className="text-2xl font-semibold text-foreground"
            >
              List title state
            </motion.div>
            <motion.div
              layoutId={postCoverId("aurora")}
              className="h-24 rounded-lg border border-border bg-border/20"
            />
            <motion.p
              layoutId={postMetaId("aurora")}
              className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground"
            >
              CAT / 2m read
            </motion.p>
          </article>
          <article className="space-y-2 rounded-[var(--radius)] border border-border bg-card/70 p-6">
            <Kicker label="Shared layout" caption="detail" />
            <motion.div
              layoutId={postTitleId("aurora")}
              className="text-2xl font-semibold text-foreground"
            >
              Detail title state
            </motion.div>
            <motion.div
              layoutId={postCoverId("aurora")}
              className="h-24 rounded-lg border border-border bg-card/60"
            />
            <motion.p
              layoutId={postMetaId("aurora")}
              className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground"
            >
              DETAIL META / 4m read
            </motion.p>
          </article>
        </section>

        <section className="space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-6">
          <Kicker label="Header overlay" caption="观察栏" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            滚动超过 48px 后顶部 header 将进入覆膜状态（blur + tint + border）。访问 <code>/</code> 可直接观察 hero 透明度。 输入 <code>?debug=1</code> 查看 HUD。
          </p>
        </section>
      </Container>
    </main>
  );
}
