"use client";

import * as React from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

// PaperAtmosphere 组件的属性接口
interface PaperAtmosphereProps {
  className?: string; // 可选的额外 CSS 类名
}

// 根据一天中的时间获取日光色调
const getDaylightTint = () => {
  const hour = new Date().getHours(); // 获取当前小时
  if (hour >= 6 && hour < 12) return "rgba(245, 246, 255, 0.03)"; // 早晨色调
  if (hour >= 12 && hour < 18) return "rgba(255, 248, 240, 0.03)"; // 中午色调
  return "rgba(244, 240, 232, 0.03)"; // 晚上色调
};

// 纸张氛围组件：创建具有纸张质感的背景效果
export default function PaperAtmosphere({ className }: PaperAtmosphereProps) {
  // 获取运动标志
  const flags = useMotionFlags();
  // 检查是否启用减少动画（用户偏好或标志）
  const reduced = useReducedMotion() || flags.reduced;
  // 计算日光色调并缓存结果
  const daylightTint = React.useMemo(() => getDaylightTint(), []);
  // 根据是否为电影模式设置漂移动画的持续时间
  const driftDuration = flags.cinema ? 14 : 18;

  return (
    // 主容器：固定定位，覆盖整个视口，置于内容下方（z-index -10）
    <div className={cn("pointer-events-none fixed inset-0 -z-10", className)}>
      {/* 动画背景层：包含多个径向渐变和线性渐变，模拟纸张纹理 */}
      <motion.div
        className="absolute inset-0"
        style={{
          // 定义多个径向渐变和一个线性渐变来创建复杂的背景纹理
          backgroundImage: `
            radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.55), transparent 55%),
            radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.2), transparent 48%),
            radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.12), transparent 55%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0))
          `,
          // 设置每个渐变的背景大小
          backgroundSize: "220% 220%, 200% 200%, 200% 200%, 100% 100%",
          // 设置每个渐变的背景位置
          backgroundPosition: "0% 0%, 100% 0%, 50% 50%, 0% 0%",
        }}
        // 如果不需要动画，则不设置 animate 属性
        animate={
          reduced
            ? undefined
            : {
                // 定义背景位置的动画序列，创建漂移效果
                backgroundPosition: [
                  "0% 0%, 100% 0%, 50% 50%, 0% 0%", // 起始位置
                  "30% 15%, 70% 10%, 45% 60%, 0% 0%", // 中间位置
                  "0% 0%, 100% 0%, 50% 50%, 0% 0%", // 回到起始位置
                ],
              }
        }
        // 如果不需要动画，则不设置 transition 属性
        transition={
          reduced
            ? undefined
            : {
                duration: driftDuration, // 漂移动画的持续时间
                ease: "linear", // 使用线性缓动函数
                repeat: Infinity, // 无限重复动画
              }
        }
      />

      {/* 纸张噪点层：创建细微的纸张纹理 */}
      <div
        className="absolute inset-0"
        style={{
          // 使用径向渐变创建噪点效果
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, var(--paper-noise-opacity)), rgba(255, 255, 255, 0)) 1px 1px",
          backgroundSize: "3px 3px", // 设置噪点的大小
          opacity: "var(--paper-noise-opacity)", // 使用 CSS 变量控制透明度
          mixBlendMode: "multiply", // 使用正片叠底混合模式
        }}
      />

      {/* 纸张暗角层：在角落添加阴影效果 */}
      <div
        className="absolute inset-0"
        style={{
          // 创建两个径向渐变作为暗角效果
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(0, 0, 0, var(--paper-vignette-opacity)), transparent 45%), radial-gradient(circle at 85% 100%, rgba(0, 0, 0, calc(var(--paper-vignette-opacity) * 0.6)), transparent 60%)",
          mixBlendMode: "soft-light", // 使用柔光混合模式
        }}
      />

      {/* 日光色调层：根据一天中的时间添加微妙的色调变化 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: daylightTint, // 应用根据时间计算的日光色调
          mixBlendMode: "soft-light", // 使用柔光混合模式
        }}
      />
    </div>
  );
}