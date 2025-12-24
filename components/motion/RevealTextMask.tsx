"use client";

import * as React from "react";
import { motion } from "motion/react";

import { maskReveal } from "@/lib/motion/variants";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

// 定义文本遮罩动画的模式类型：按行(lines)或按词(words)进行动画
type Mode = "lines" | "words";

// RevealTextMask 组件的属性接口
interface RevealTextMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  // 需要展示的文本内容
  text: string;
  // 动画模式：'lines' 整行显示，'words' 逐词显示
  mode?: Mode;
  // 渲染的HTML元素类型，默认为div
  as?: React.ElementType;
  // 动画开始前的延迟时间
  delay?: number;
  // 逐词动画时，每个词之间的间隔时间
  stagger?: number;
}

// 将文本分割成单词或字符的辅助函数
// 对于包含中文的文本，将其拆分为单个字符；对于英文文本，按空格拆分为单词
const splitWords = (text: string) => {
  const containsCJK = /\p{Script=Han}/u.test(text);
  if (containsCJK) {
    return Array.from(text);
  }

  const segments = text.split(/(\s+)/).filter(Boolean);
  if (segments.length === 0) {
    return Array.from(text);
  }
  return segments;
};

// RevealTextMask 组件：实现文本遮罩揭示动画效果
export default function RevealTextMask({
  text,
  mode = "lines",
  as: Component = "div", // 使用 as 属性来指定渲染的HTML元素类型
  delay = 0,
  stagger,
  className,
  ...props
}: RevealTextMaskProps) {
  // 获取系统是否启用了减少动画的设置
  const isReduced = useReducedMotion();
  // 获取运动标志（如电影院模式等）
  const flags = useMotionFlags();
  // 如果系统设置或应用标志要求减少动画，则禁用动画
  const reduced = isReduced || flags.reduced;
  // 根据是否启用电影院模式来调整动画速度
  const tempo = flags.cinema ? motionTokens.durations.slow : motionTokens.durations.normal;

  // 如果需要减少动画，则直接返回普通文本，不应用任何动画效果
  if (reduced) {
    return (
      <Component className={cn("text-current", className)} {...props}>
        {text}
      </Component>
    );
  }

  // 将文本分割为单词或字符数组
  const words = splitWords(text);
  // 设置动画间隔时间，如果未指定则使用默认值
  const step = stagger ?? motionTokens.limits.stagger;
  // 获取遮罩揭示动画变体
  const variant = maskReveal();

  // 如果模式为 'lines'，则对整行文本应用遮罩动画
  if (mode === "lines") {
    return (
      <Component
        className={cn("overflow-hidden text-current", className)}
        {...props}
      >
        <motion.span
          className="inline-block"
          variants={variant}
          initial="hidden" // 初始状态为隐藏
          animate="visible" // 动画状态为可见
          transition={{ delay, duration: tempo }} // 设置延迟和持续时间
        >
          {text}
        </motion.span>
      </Component>
    );
  }

  // 如果模式为 'words'，则对每个单词分别应用遮罩动画
  return (
    <Component
      className={cn("inline-flex flex-wrap gap-[0.125rem] overflow-hidden text-current", className)}
      {...props}
    >
      {words.map((segment, index) => {
        const isSpace = /^\s+$/.test(segment); // 检查当前段是否为空格
        return (
          <motion.span
            key={`${segment}-${index}`} // 使用段落内容和索引作为唯一键
            className={cn(
              "inline-block",
              isSpace ? "w-1" : "" // 如果是空格，则设置固定宽度
            )}
            variants={variant} // 应用遮罩揭示动画变体
            initial="hidden" // 初始状态为隐藏
            animate="visible" // 动画状态为可见
            transition={{
              delay: delay + index * step, // 每个单词的延迟时间递增
              duration: flags.cinema ? motionTokens.durations.normal : motionTokens.durations.fast, // 根据是否为电影院模式调整持续时间
            }}
          >
            {segment} 
          </motion.span>
        );
      })}
    </Component>
  );
}