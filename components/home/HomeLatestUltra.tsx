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
          <Kicker label="Latest entries" caption="Catalog" />
          <p className="max-w-2xl text-sm text-muted-foreground">
            Recent notes curated as an exhibition list. Each entry keeps the rhythm
            of a museum placard: title first, metadata after.
          </p>
        </motion.div>

        <CatalogList items={items} stagger={!reduced} />
      </Container>
    </section>
  );
}
