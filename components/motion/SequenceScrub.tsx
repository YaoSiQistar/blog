"use client";

import * as React from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/reduced";

export type CanvasSequenceProps = {
  frames: string[];
  heightVh?: number;
  className?: string;
  objectFit?: "cover" | "contain";
};

export default function CanvasSequence({
  frames,
  heightVh = 300,
  className,
  objectFit = "cover",
}: CanvasSequenceProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const imagesRef = React.useRef<HTMLImageElement[]>([]);
  const prefersReduced = useReducedMotion();

  // 1. 预加载所有图像
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let loadedCount = 0;
    const totalFrames = frames.length;

    if (totalFrames === 0) return;

    frames.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
          renderFrame(0); // 初始渲染第一帧
        }
      };
      imagesRef.current[i] = img;
    });
  }, [frames]);

  // 2. 核心绘画逻辑 (模拟 CSS object-fit)
  const renderFrame = React.useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[index];
      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 处理高分屏 (Retina)
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (objectFit === "cover") {
        if (imgRatio > canvasRatio) {
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        }
      } else {
        // contain 逻辑
        if (imgRatio > canvasRatio) {
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    [objectFit]
  );

  // 3. 滚动监听
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded || prefersReduced) return;
    const frameIndex = Math.min(
      frames.length - 1,
      Math.floor(latest * frames.length)
    );
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  // 窗口缩放重新渲染
  React.useEffect(() => {
    const handleResize = () => renderFrame(Math.floor(scrollYProgress.get() * (frames.length - 1)));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, scrollYProgress, frames.length]);

  if (prefersReduced) {
    return <section className="p-12 text-center"><img src={frames[0]} className="mx-auto rounded-lg" /></section>;
  }

  return (
    <section 
      ref={sectionRef} 
      className={cn("relative w-full", className)} 
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 预加载进度 (可选) */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
             <p className="text-sm font-mono animate-pulse">LOADING SEQUENCE...</p>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: isLoaded ? "block" : "none" }}
        />
      </div>
    </section>
  );
}