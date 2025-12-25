"use client";

import { motion } from "motion/react";

import Container from "@/components/shell/Container";
import Kicker from "@/components/editorial/Kicker";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

export default function HomeFooterNote() {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;

  return (
    <section id="footer" data-section="footer" className="py-(--section-y)">
      <Container variant="wide">
        <motion.div
          variants={fadeUp(reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-[var(--radius)] border border-border bg-card/70 p-8"
        >
          <Kicker label="Curator note" caption="Footer" />
          <p className="mt-4 text-sm text-muted-foreground">
            Thank you for visiting my personal blog. Here, I share my thoughts,
            experiences, and insights on various topics that interest me. I hope
            you find the content engaging and thought-provoking. Feel free to
            explore, comment, and connect with me. Your feedback and interaction
            are highly appreciated as they help me grow and improve this space.
            Happy reading!
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
