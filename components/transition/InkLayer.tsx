"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import type { TransitionStage } from "@/lib/motion/transition-stage";

// 墨水层的动画变体定义
const inkVariants = {
  hidden: { opacity: 0 }, // 隐藏状态：完全透明
  visible: { opacity: motionTokens.transition.inkOpacity }, // 可见状态：使用预定义的墨水透明度
};

// InkLayer 组件的属性接口
interface InkLayerProps {
  stage: TransitionStage; // 当前过渡阶段
  isReduced: boolean; // 是否启用了减少动画的用户偏好
}

// 墨水过渡层组件：在页面转换时显示墨水扩散效果
export default function InkLayer({ stage, isReduced }: InkLayerProps) {
  // 如果用户启用了减少动画的偏好，则不渲染任何内容
  if (isReduced) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* 只有在 "interlude"（间奏）阶段才显示墨水层 */}
      {stage === "interlude" && (
        <motion.div
          key="ink-layer"
          aria-hidden="true" // 从可访问性树中隐藏此元素
          className="pointer-events-none fixed inset-0" // 设置为固定定位，覆盖整个视口，且不响应鼠标事件
          initial="hidden" // 初始状态为隐藏
          animate="visible" // 动画到可见状态
          exit="hidden" // 退出时回到隐藏状态
          variants={inkVariants} // 应用墨水层动画变体
          transition={{
            duration: motionTokens.transition.interlude, // 使用预定义的间奏持续时间
            ease: motionTokens.easing.easeInOut, // 使用缓入缓出的缓动函数
          }}
        >
          {/* 墨水效果的视觉元素 */}
          <div
            className="absolute inset-0" // 绝对定位，覆盖父容器
            style={{
              // 创建两个径向渐变，模拟墨水扩散效果
              backgroundImage: `
                radial-gradient(circle at 20% 30%, ${motionTokens.transition.inkColor}, transparent 45%),
                radial-gradient(circle at 70% 60%, ${motionTokens.transition.inkColor}, transparent 55%)
              `,
              // 使用遮罩创建中心透明、边缘半透明的效果
              maskImage:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 65%)",
              // 使用 multiply 混合模式增强墨水效果
              mixBlendMode: "multiply",
              // 应用模糊滤镜以获得更柔和的边缘
              filter: `blur(${motionTokens.transition.blur}px)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}