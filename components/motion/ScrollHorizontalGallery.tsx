"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useResizeObserver } from "@/lib/perf/useResizeObserver";

export type HorizontalGalleryItem = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
};

type ScrollHorizontalGalleryProps = {
  items: HorizontalGalleryItem[];
  snapOnMobile?: boolean;
  endCap?: boolean;
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

export default function ScrollHorizontalGallery({
  items,
  snapOnMobile = true,
  endCap = true,
  className,
}: ScrollHorizontalGalleryProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const reduced = prefersReduced;

  // 引用说明：
  // sectionRef: 外部容器，决定总滚动高度
  // trackRef: 内部水平长条，用于测量实际内容宽度
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const { ref: trackRef, size } = useResizeObserver<HTMLDivElement>();

  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);

  // 初始化和监听窗口宽度
  React.useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 监听内容宽度变化（包括图片加载后可能的尺寸变化）
  React.useEffect(() => {
    if (trackRef.current) {
      setContentWidth(trackRef.current.scrollWidth);
    }
  }, [size.width, items.length]);

  // 计算核心：
  // maxX 是内容超出屏幕的宽度，即需要横向滑动的距离
  const maxX = Math.max(0, contentWidth - viewportWidth);

  // 动态计算父容器高度：100vh (起始全屏) + 实际位移距离
  // 这样能保证滚动体感是 1:1 的真实物理反馈
  const dynamicHeight = React.useMemo(() => {
    if (maxX === 0) return "auto";
    return `calc(100vh + ${maxX}px)`;
  }, [maxX]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 使用 spring 平滑化处理，避免滚动锯齿感
  const smoothX = useSpring(useTransform(scrollYProgress, [0, 1], [0, -maxX]), {
    damping: 20,
    stiffness: 90,
  });

  // 减弱动画或移动端降级处理
  if (reduced) {
    return (
      <section className={cn("px-6 py-12", className)}>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }

  if (isMobile) {
    return (
      <section className={cn("overflow-hidden py-8", className)}>
        <div
          className={cn(
            "flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar",
            snapOnMobile ? "snap-x snap-mandatory" : ""
          )}
        >
          {items.map((item) => (
            <div key={item.id} className={cn("min-w-[80vw]", snapOnMobile ? "snap-start" : "")}>
              <GalleryCard item={item} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className={cn("relative", className)}
      style={{ height: dynamicHeight }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex gap-8 pr-[10vw]"
          style={{ x: smoothX }}
        >
          {items.map((item) => (
            <div key={item.id} className="w-[450px] shrink-0">
              <GalleryCard item={item} isDesktop />
            </div>
          ))}
          {/* 结束填充，确保最后一张能滚到视野左侧 */}
          {endCap && <div className="min-w-[20vw] shrink-0" />}
        </motion.div>
      </div>
    </section>
  );
}

// 抽取卡片组件以保持代码整洁
function GalleryCard({ item, isDesktop = false }: { item: HorizontalGalleryItem; isDesktop?: boolean }) {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:bg-card/80",
      isDesktop ? "h-[60vh]" : "h-full"
    )}>
      <div>
        {item.image && (
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
          Collection
        </div>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{item.title}</h3>
      </div>
      
      {item.subtitle && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {item.subtitle}
        </p>
      )}
    </div>
  );
}
