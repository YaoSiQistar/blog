"use client";

import { motion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";
import type { TransitionStage } from "@/lib/motion/transition-stage";

// 胶片层的动画变体定义，包含不同过渡阶段的样式
const filmVariants = {
  // 闲置状态：完全透明，无模糊效果
  idle: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  // 退出状态：显示胶片效果，应用模糊和预设的透明度
  exit: {
    opacity: motionTokens.transition.filmOpacity, // 使用预定义的胶片透明度
    backdropFilter: `blur(${motionTokens.transition.filmBlur}px)`, // 应用胶片模糊效果
    transition: {
      duration: motionTokens.transition.exit, // 使用预定义的退出动画持续时间
      ease: motionTokens.easing.easeOut, // 使用缓出缓动函数
    },
  },
  // 间奏状态：稍微增加透明度，保持模糊效果
  interlude: {
    opacity: motionTokens.transition.filmOpacity * 1.1, // 透明度比退出状态稍高
    backdropFilter: `blur(${motionTokens.transition.filmBlur}px)`, // 保持相同的模糊效果
    transition: {
      duration: motionTokens.transition.interlude, // 使用预定义的间奏动画持续时间
      ease: motionTokens.easing.easeInOut, // 使用缓入缓出缓动函数
    },
  },
  // 进入状态：逐渐消失，模糊效果减小
  enter: {
    opacity: 0, // 最终完全透明
    backdropFilter: "blur(0px)", // 模糊效果减小到无
    transition: {
      duration: motionTokens.transition.enter, // 使用预定义的进入动画持续时间
      ease: motionTokens.easing.easeOut, // 使用缓出缓动函数
    },
  },
};

// FilmLayer 组件的属性接口
interface FilmLayerProps {
  stage: TransitionStage; // 当前过渡阶段（idle, exit, interlude, enter）
  isReduced: boolean; // 是否启用了减少动画的用户偏好
}

// 胶片过渡层组件：在页面转换时显示胶片效果
export default function FilmLayer({ stage, isReduced }: FilmLayerProps) {
  // 如果用户启用了减少动画的偏好，则不渲染任何内容
  if (isReduced) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true" // 从可访问性树中隐藏此元素
      className="pointer-events-none fixed inset-0 border border-solid" // 设置为固定定位，覆盖整个视口，且不响应鼠标事件，带边框
      variants={filmVariants} // 应用胶片层动画变体
      animate={stage} // 根据当前过渡阶段执行相应的动画
      initial="idle" // 初始状态为闲置状态
      style={{
        mixBlendMode: "soft-light", // 使用柔光混合模式，创建胶片效果
        borderColor: motionTokens.transition.filmBorder, // 使用预定义的胶片边框颜色
        backgroundColor: motionTokens.transition.filmTint, // 使用预定义的胶片着色
      }}
    />
  );
}