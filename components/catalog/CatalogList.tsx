'use client'
import * as React from "react";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

import { staggerContainer } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { CatalogItem, CatalogPost } from "./CatalogItem";

interface CatalogListProps extends React.HTMLAttributes<HTMLElement> {
  items: CatalogPost[];
  stagger?: boolean;
}

export default function CatalogList({
  items,
  stagger = true,
  className,
  ...props
}: CatalogListProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;

  return (
    <motion.section
      variants={stagger ? staggerContainer(reduced) : undefined}
      initial={stagger ? "hidden" : undefined}
      animate={stagger ? "visible" : undefined}
      className={cn("space-y-5", className)}
      {...props}
    >
      {items.map((item, index) => (
        <CatalogItem
          key={`${item.slug}-${item.date}`}
          {...item}
          index={index}
          isReduced={reduced || !stagger}
        />
      ))}
    </motion.section>
  );
}

export type { CatalogPost } from "./CatalogItem";
