"use client";

import { motion } from "motion/react";

import Container from "@/components/shell/Container";
import Kicker from "@/components/editorial/Kicker";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import AnimatedLink from "@/components/motion/AnimatedLink";

interface GalleryItem {
  slug: string;
  count: number;
}

interface HomeGalleriesProps {
  categories: GalleryItem[];
  tags: GalleryItem[];
}

export default function HomeGalleries({ categories, tags }: HomeGalleriesProps) {
  const prefersReduced = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = prefersReduced || flags.reduced;

  return (
    <section id="galleries" data-section="galleries" className="py-[var(--section-y)]">
      <Container variant="wide">
        <motion.div
          variants={fadeUp(reduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 space-y-3"
        >
          <Kicker label="Galleries" caption="Entrance" />
          <p className="max-w-2xl text-sm text-muted-foreground">
            Navigate the archive by room. Categories behave like wings in a museum,
            while tags act as small placards that connect related works.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer(reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-[var(--radius)] border border-border bg-card/70 p-6"
          >
            <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Categories
            </div>
            <div className="mt-4 grid gap-3">
              {categories.map((item) => (
                <motion.div key={item.slug} variants={staggerItem(reduced)}>
                  <AnimatedLink href={`/categories/${item.slug}`}>
                    <span className="text-sm">{item.slug}</span>
                    <span className="text-xs text-muted-foreground/70">
                      {" "}
                      ({item.count})
                    </span>
                  </AnimatedLink>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer(reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-[var(--radius)] border border-border bg-card/70 p-6"
          >
            <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Tags
            </div>
            <div className="mt-4 grid gap-3">
              {tags.slice(0, 8).map((item) => (
                <motion.div key={item.slug} variants={staggerItem(reduced)}>
                  <AnimatedLink href={`/tags/${item.slug}`}>
                    <span className="text-sm">{item.slug}</span>
                    <span className="text-xs text-muted-foreground/70">
                      {" "}
                      ({item.count})
                    </span>
                  </AnimatedLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
