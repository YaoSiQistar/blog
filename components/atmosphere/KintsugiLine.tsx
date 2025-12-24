"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

// KintsugiLine 组件的属性接口
interface KintsugiLineProps {
  sectionIds: string[]; // 页面中各个区域的 ID 数组
  className?: string; // 可选的额外 CSS 类名
}

// SVG 路径定义：定义金缮线条的形状
const pathD =
  "M60 0 C54 80, 68 140, 58 220 S64 360, 52 440 S66 600, 58 720 S70 880, 60 1000";

// 金缮线条组件：显示页面滚动进度和当前活跃区域
export default function KintsugiLine({ sectionIds, className }: KintsugiLineProps) {
  // 检查用户是否启用了减少动画的偏好设置
  const prefersReduced = useReducedMotion();
  // 获取运动标志
  const flags = useMotionFlags();
  // 确定是否启用减少动画（用户偏好或标志）
  const reduced = prefersReduced || flags.reduced;
  // 获取页面滚动进度
  const { scrollYProgress } = useScroll();
  // 将滚动进度转换为路径长度（从 0.4 到 1），用于控制线条显示
  const scrollLength = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  // 状态：记录线条是否已绘制完成
  const [drawn, setDrawn] = React.useState(false);
  // 状态：当前活跃的区域 ID
  const [activeSection, setActiveSection] = React.useState(sectionIds[0] ?? "hero");

  // 当活跃区域变化时，更新文档根元素的 data-activeSection 属性
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.activeSection = activeSection;
  }, [activeSection]);

  // 设置交叉观察器来检测哪些区域在视口中
  React.useEffect(() => {
    // 如果没有区域 ID，则返回
    if (sectionIds.length === 0) return;
    
    const observers: IntersectionObserver[] = [];

    // 为每个区域 ID 创建交叉观察器
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      // 创建交叉观察器，当元素的可见比例达到 30% 时触发
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id); // 设置该区域为活跃区域
          }
        },
        { threshold: 0.3 } // 设置交叉阈值为 30%
      );
      
      observer.observe(element); // 开始观察元素
      observers.push(observer);
    });

    // 清理函数：断开所有观察器连接
    return () => observers.forEach((observer) => observer.disconnect());
  }, [sectionIds]);

  return (
    // 主容器：固定定位，位于左侧，仅在大屏幕上显示
    <div
      className={cn(
        "pointer-events-none fixed left-6 top-0 z-10 hidden h-full w-[120px] lg:block", // 隐藏鼠标事件，固定定位，仅在大屏幕上显示
        className
      )}
    >
      {/* SVG 容器：包含金缮线条 */}
      <svg
        viewBox="0 0 120 1000" // 设置 SVG 视图框
        className="h-full w-full" // 填充父容器
        aria-hidden="true" // 从可访问性树中隐藏
      >
        {/* 动画路径：仅在未启用减少动画时显示，模拟线条绘制动画 */}
        {!reduced && (
          <motion.path
            d={pathD} // 使用预定义的路径数据
            fill="none" // 无填充
            stroke="currentColor" // 使用当前颜色作为描边颜色
            strokeWidth={1.5} // 设置描边宽度
            strokeLinecap="round" // 设置线帽为圆形
            initial={{ pathLength: 0, opacity: 0 }} // 初始状态：路径长度为 0，透明度为 0
            animate={{ pathLength: 0.4, opacity: 1 }} // 动画状态：路径长度为 0.4，透明度为 1
            transition={{
              delay: motionTokens.ultra.lineDrawDelay, // 延迟开始动画
              duration: motionTokens.ultra.lineDrawDuration, // 动画持续时间
              ease: motionTokens.easing.easeOut, // 使用缓出缓动函数
            }}
            className="text-primary/60" // 设置描边颜色为主要颜色的 60% 透明度
            onAnimationComplete={() => setDrawn(true)} // 动画完成时设置 drawn 状态为 true
          />
        )}
        {/* 滚动路径：根据滚动进度显示的路径 */}
        <motion.path
          d={pathD} // 使用预定义的路径数据
          fill="none" // 无填充
          stroke="currentColor" // 使用当前颜色作为描边颜色
          strokeWidth={1.5} // 设置描边宽度
          strokeLinecap="round" // 设置线帽为圆形
          style={{
            pathLength: reduced ? 1 : scrollLength, // 如果减少动画则路径长度为 1，否则使用滚动转换后的路径长度
            opacity: reduced ? 0.4 : drawn ? 1 : 0, // 如果减少动画则透明度为 0.4，否则如果已绘制完成则为 1，否则为 0
          }}
          className="text-primary/60" // 设置描边颜色为主要颜色的 60% 透明度
        />
      </svg>

      {/* 区域标签容器：显示各个区域的标签 */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-10 text-[0.55rem] uppercase tracking-[0.4em] text-muted-foreground">
        {/* 渲染每个区域的标签 */}
        {sectionIds.map((id) => (
          <span
            key={id}
            className={
              id === activeSection
                ? "text-primary" // 当前活跃区域使用主要颜色
                : "text-muted-foreground/70" // 其他区域使用较淡的颜色
            }
          >
            {id} {/* 显示区域 ID 作为标签 */}
          </span>
        ))}
      </div>
    </div>
  );
}