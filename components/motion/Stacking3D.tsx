"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export type StackingCard = {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  gradient?: string;
};

type PremiumStackProps = {
  cards: StackingCard[];
  className?: string;
};

export default function PremiumStack({ cards, className }: PremiumStackProps) {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 使用 Spring 平滑滚动数值，减少顿挫感
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  return (
    <section 
      ref={sectionRef} 
      className={cn("relative", className)} 
      style={{ height: `${cards.length * 120}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        {/* 背景装饰光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

        <div className="relative h-[450px] w-[min(600px,92vw)] [perspective:2000px]">
          {cards.map((card, index) => (
            <PremiumCard 
              key={card.id} 
              card={card} 
              index={index} 
              total={cards.length} 
              progress={smoothProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumCard({ card, index, total, progress }: any) {
  const start = index / total;
  const end = (index + 1) / total;
  const center = (start + end) / 2;

  // 1. 深度与位移
  // 进入：从下方滑入并伴随旋转
  // 退出：向上方弹射并缩小
  const y = useTransform(progress, [start, center, end], [600, 0, -200]);
  const z = useTransform(progress, [start, center, end], [-400, 0, -100]);
  const rotateX = useTransform(progress, [start, center, end], [45, 0, -20]);
  const scale = useTransform(progress, [start, center, end], [0.8, 1, 0.9]);

  // 2. 光影控制
  const opacity = useTransform(progress, [start - 0.05, start, end, end + 0.05], [0, 1, 1, 0]);
  const shadowOpacity = useTransform(progress, [start, center, end], [0, 0.2, 0]);
  
  // 3. 内容视差效果
  const contentY = useTransform(progress, [start, center, end], [40, 0, -20]);
  const contentOpacity = useTransform(progress, [center - 0.1, center, center + 0.1], [0, 1, 0]);

  return (
    <motion.article
      style={{
        y,
        z,
        rotateX,
        scale,
        opacity,
        zIndex: total - index,
        boxShadow: `0 30px 100px rgba(0,0,0,${shadowOpacity})`,
      }}
      className={cn(
        "absolute inset-0 rounded-[2.5rem] border border-white/10 p-12",
        "bg-gradient-to-br from-card/90 to-card/40 backdrop-blur-2xl",
        "flex flex-col justify-between overflow-hidden"
      )}
    >
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-widest text-primary">
          {card.tag || "Innovation"}
        </div>
        <div className="text-4xl font-black italic opacity-5 leading-none">
          0{index + 1}
        </div>
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="space-y-4">
        <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]">
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="text-lg text-muted-foreground max-w-[340px] leading-relaxed">
            {card.subtitle}
          </p>
        )}
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      {/* 底部发光背景 */}
      <div className={cn(
        "absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20",
        card.gradient || "bg-primary"
      )} />
    </motion.article>
  );
}