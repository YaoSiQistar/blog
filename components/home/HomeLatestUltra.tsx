"use client";

import { motion } from "motion/react";

import Container from "@/components/shell/Container";
import Kicker from "@/components/editorial/Kicker";
import CatalogList, { CatalogPost } from "@/components/catalog/CatalogList";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

interface HomeLatestUltraProps {
  items: CatalogPost[];
}

export default function HomeLatestUltra({ items }: HomeLatestUltraProps) {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;

  return (
    <section id="latest" data-section="latest" className="py-[var(--section-y)]">
      <Container variant="wide">
        <motion.div
          variants={fadeUp(reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-8 space-y-3"
        >
          <Kicker label="最新条目" caption="目录" />
          <p className="max-w-2xl text-sm text-muted-foreground">
            最新笔记被整理成展览清单。每条保持博物馆展签的节奏。
          </p>
        </motion.div>

        <CatalogList items={items} stagger={!reduced} />
      </Container>
    </section>
  );
}
