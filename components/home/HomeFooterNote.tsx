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
          <Kicker label="编者札记" caption="尾声" />
          <p className="mt-4 text-sm text-muted-foreground">
            感谢你来到我的个人博客。在这里，我记录感兴趣话题的思考、经历与洞见。
            希望这些内容能带来启发与共鸣，欢迎自由探索、评论并与我交流。
            你的反馈与互动对我非常重要，它们帮助我持续完善这片空间。阅读愉快。
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
