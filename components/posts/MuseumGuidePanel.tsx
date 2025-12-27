"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import { updatePostsQuery } from "./query";

// 定义导航项类型，包含slug和数量
type GuideItem = { slug: string; count: number };

// 定义博物馆导航面板组件的属性类型
type MuseumGuidePanelProps = {
  categories: GuideItem[];  // 分类数组
  tags: GuideItem[];        // 标签数组
};

// 博物馆导航面板组件 - 用于显示分类和标签的导航面板
// 提供分类筛选、标签搜索和过滤功能，支持动画效果和无障碍访问
export default function MuseumGuidePanel({ categories, tags }: MuseumGuidePanelProps) {
  // 获取路由器实例，用于导航
  const router = useRouter();
  // 获取当前搜索参数
  const searchParams = useSearchParams();
  // 检查用户是否偏好减少动画
  const reducedMotion = useReducedMotion();
  // 获取动画标志
  const flags = useMotionFlags();
  // 综合判断是否需要减少动画效果
  const reduced = reducedMotion || flags.reduced;
  // 状态用于存储标签搜索查询
  const [tagQuery, setTagQuery] = React.useState("");
  // 状态用于控制标签列表是否展开
  const [expanded, setExpanded] = React.useState(false);

  // 获取当前选中的分类
  const currentCategory = searchParams.get("category") || undefined;
  // 获取当前选中的标签数组
  const selectedTags = React.useMemo(() => {
    const raw = searchParams.get("tags");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  // 获取可见的标签列表（根据搜索查询和展开状态过滤）
  const visibleTags = React.useMemo(() => {
    const filtered = tags.filter((tag) =>
      tag.slug.toLowerCase().includes(tagQuery.trim().toLowerCase())
    );
    return expanded ? filtered : filtered.slice(0, 10);  // 如果未展开，只显示前10个标签
  }, [expanded, tagQuery, tags]);

  // 处理分类点击事件
  // 如果点击的分类已经是当前分类，则取消选择；否则选择新的分类
  const handleCategoryClick = (slug: string) => {
    const nextCategory = currentCategory === slug ? undefined : slug;
    const { href } = updatePostsQuery(searchParams, { next: { category: nextCategory } });
    if (href) router.push(href);
  };

  // 处理标签切换事件
  // 如果标签已选中，则从选中列表中移除；否则添加到选中列表
  const handleTagToggle = (slug: string) => {
    const nextTags = selectedTags.includes(slug)
      ? selectedTags.filter((tag) => tag !== slug)
      : [...selectedTags, slug];
    const { href } = updatePostsQuery(searchParams, { next: { tags: nextTags } });
    if (href) router.push(href);
  };

  // 处理重置按钮点击事件
  // 清除所有筛选条件，重置为默认状态
  const handleReset = () => {
    const { href } = updatePostsQuery(searchParams, {
      next: { category: undefined, tags: [], q: undefined, sort: "latest", page: 1 },
      resetPage: true,
    });
    if (href) router.push(href);
  };

  return (
    <motion.aside  
      variants={fadeUp(reduced)} 
      initial="hidden"            
      animate="visible"           
      className="space-y-6 rounded-[var(--radius)] border border-border bg-card/70 p-5"  // 样式类
    >
      {/* 分类部分标题 */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
          博物馆展厅
        </p>
        <h3 className="text-base font-semibold text-foreground">展厅</h3>
      </div>

      {/* 分类列表 */}
      <div className="space-y-2">
        {categories.map((item) => {
          const active = currentCategory === item.slug;  
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleCategoryClick(item.slug)}
              className={cn(
                "group relative flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm transition",
                "before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-transparent before:transition-colors",
                active
                  ? "border-primary/60 bg-primary/10 text-foreground before:bg-primary/70"  // 激活状态样式
                  : "border-border-subtle bg-card/50 text-muted-foreground hover:border-primary/50 hover:before:bg-primary/60"  // 非激活状态样式
              )}
            >
              <span className="flex items-center gap-2">
                {/* 激活状态指示器 */}
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    active ? "bg-primary" : "bg-border"
                  )}
                />
                <span className={cn(active && "text-foreground")}>{item.slug}</span>
              </span>
              <span className="text-xs text-muted-foreground/70">{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* 标签部分 */}
      <div className="space-y-3">
        {/* 标签部分标题和展开/收起按钮 */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">热门标签</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[0.6rem] uppercase tracking-[0.3em]"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label="Toggle tags"
          >
            {expanded ? (
              <>
                收起 <ChevronUp className="ml-1 size-3" />
              </>
            ) : (
              <>
                更多 <ChevronDown className="ml-1 size-3" />
              </>
            )}
          </Button>
        </div>
        {/* 标签搜索输入框 */}
        <Input
          value={tagQuery}
          onChange={(event) => setTagQuery(event.target.value)}
          placeholder="搜索标签"
          className="h-9 text-sm"
          aria-label="Search tags"
        />
        {/* 标签列表 */}
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => {
            const active = selectedTags.includes(tag.slug);  
            return (
              <button
                key={tag.slug}
                type="button"
                onClick={() => handleTagToggle(tag.slug)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] transition",
                  active
                    ? "border-primary/60 bg-primary/10 text-foreground"      
                    : "border-border-subtle text-muted-foreground hover:border-primary/50"  
                )}
              >
                {active && <Check className="size-3" />} 
                {tag.slug}
              </button>
            );
          })}
        </div>
      </div>

      {/* 快捷方式部分 */}
      <div className="space-y-2 rounded-2xl border border-border-subtle bg-card/80 p-3">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          快捷入口
        </p>
        <Button asChild variant="ghost" className="w-full justify-between text-sm">
          <Link href="/me">
            <span>我的收藏</span>
            <span className="text-xs text-muted-foreground/60">/me</span>
          </Link>
        </Button>
      </div>

      {/* 重置按钮 */}
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleReset}
      >
        清空导览
      </Button>
    </motion.aside>
  );
}
