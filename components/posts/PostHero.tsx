"use client";

import { motion } from "motion/react";

import { postCoverId, postMetaId, postTitleId } from "@/lib/motion/ids";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";

// PostHero 组件的属性接口，定义了文章头部所需的所有信息
interface PostHeroProps {
  title: string;        // 文章标题
  slug: string;         // 文章的URL标识符
  date: string;         // 文章发布日期
  readingTime: string;  // 预计阅读时间
  category: string;     // 文章分类
  tags: string[];       // 文章标签数组
  excerpt: string;      // 文章摘要
  cover?: string;       // 文章封面图片URL（可选）
}

// PostHero 组件：展示文章头部信息，包括标题、元数据、摘要和封面图
export default function PostHero({
  title,
  slug,
  date,
  readingTime,
  category,
  tags,
  excerpt,
  cover,
}: PostHeroProps) {
  // 获取用户是否偏好减少动画的设置
  const prefersReduced = useReducedMotion();
  // 获取应用的运动标志
  const flags = useMotionFlags();
  // 判断是否需要减少动画效果
  const reduced = prefersReduced || flags.reduced;

  return (
    // 使用motion.div作为容器，应用淡入向上动画
    <motion.div variants={fadeUp(reduced)} initial="hidden" animate="visible">
      {/* 文章标题，使用layoutId实现页面间过渡动画 */}
      <motion.h1
        layoutId={postTitleId(slug)} // 基于文章slug生成唯一的布局ID
        className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl"
      >
        {title}
      </motion.h1>
      {/* 文章元数据，包括日期、阅读时间、分类和标签 */}
      <motion.div
        layoutId={postMetaId(slug)} // 基于文章slug生成唯一的布局ID
        className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span>{date}</span>
        <span>{readingTime}</span>
        <span>{category}</span>
        <span>{tags.join(", ")}</span> {/* 将标签数组转换为逗号分隔的字符串 */}
      </motion.div>
      {/* 文章摘要 */}
      <p className="mt-6 text-base text-muted-foreground">{excerpt}</p>
      {/* 条件渲染封面图片，如果提供了封面图片URL则显示 */}
      {cover ? (
        <motion.img
          layoutId={postCoverId(slug)}
          src={cover}
          alt=""
          loading="lazy"
          className="mt-6 w-full h-auto rounded-[var(--radius)] border border-border"
        />
      ) : null} {/* 如果没有提供封面图片，则不渲染任何内容 */}
    </motion.div>
  );
}