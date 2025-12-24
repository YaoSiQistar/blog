"use client";

import * as React from "react";
import { motion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

// SheenHover 组件的属性类型，继承自 HTMLDivElement 的属性
type SheenHoverProps = React.HTMLAttributes<HTMLDivElement>;

// SheenHover 组件：为子元素添加光泽悬停效果
export default function SheenHover({
  children,
  className,
  ...props
}: SheenHoverProps) {
  // 获取系统是否启用了减少动画的设置
  const isReduced = useReducedMotion();
  // 获取运动标志（如电影院模式等）
  const flags = useMotionFlags();
  // 如果系统设置或应用标志要求减少动画，则禁用动画
  const reduced = isReduced || flags.reduced;
  // 计算光泽效果的透明度，根据是否启用电影院模式调整
  const opacity = motionTokens.hover.sheenOpacity + (flags.cinema ? motionTokens.ultra.sheenOpacityCinemaBoost : 0);

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {/* 渲染子元素 */}
      {children}
      {/* 只有在不禁用动画的情况下才渲染光泽效果 */}
      {!reduced && (
        <motion.span
          aria-hidden="true" // 对屏幕阅读器隐藏此元素
          className="pointer-events-none absolute inset-0 flex items-stretch" // 设置为绝对定位，不响应指针事件
          initial={{ x: "-55%", opacity: 0 }} // 初始状态：从左侧-55%位置开始，透明度为0
          whileHover={{
            x: "120%", // 悬停时：移动到右侧120%位置
            opacity,  // 悬停时：应用计算的透明度
          }}
          transition={{
            duration: flags.cinema ? motionTokens.durations.normal : motionTokens.hover.sheenDuration, // 根据是否为电影院模式设置动画持续时间
            ease: motionTokens.hover.sheenEase, // 设置动画缓动函数
          }}
        >
          {/* 第一个光泽层：使用渐变和模糊效果创建主要光泽 */}
          <span
            className="h-full w-[65%] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-xl"
            style={{ mixBlendMode: "screen" }} // 使用screen混合模式，使光泽效果更加明亮
          />
          {/* 第二个光泽层：使用较小的宽度和位置偏移创建次要光泽 */}
          <span
            className="h-full w-[35%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ transform: "translateX(-20%)" }} // 向左偏移20%，与第一个光泽层形成交错效果
          />
        </motion.span>
      )}
    </div>
  );
}