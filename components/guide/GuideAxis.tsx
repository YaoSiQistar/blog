"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";
import type { GuideNode, GuideNodePosition, GuideRailMode } from "@/lib/guide-rail/types";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion/tokens";
import { guideRailTokens } from "./tokens";

const heroPathD =
  "M60 0 C54 80, 68 140, 58 220 S64 360, 52 440 S66 600, 58 720 S70 880, 60 1000";

// GuideAxis 组件的属性类型定义
type GuideAxisProps = {
  // 引导节点数组，包含导航信息
  nodes: GuideNode[];
  // 当前活跃节点的 ID
  activeId?: string;
  // 映射后的节点位置数组
  mappedNodes: GuideNodePosition[];
  // 导航栏的高度
  railHeight: number;
  // 导航到指定节点的函数
  goTo: (node: GuideNode) => void;
  // 滚动进度（0-1 之间）
  progress: number;
  // 导航栏的引用，用于获取 DOM 元素
  railRef: RefObject<HTMLDivElement>;
  // 是否减少动画效果
  reduced?: boolean;
  // 引导栏模式
  mode: GuideRailMode;
  // 是否显示节点标签
  showLabels?: boolean;
};

/**
 * GuideAxis 组件
 * 一个垂直引导轴组件，显示页面内容的导航节点
 * 通过滚动进度高亮当前活动节点，并提供导航到指定节点的功能
 */
export function GuideAxis({
  nodes,
  activeId,
  mappedNodes,
  railHeight,
  goTo,
  progress,
  railRef,
  reduced,
  mode,
  showLabels = false,
}: GuideAxisProps) {
  // 创建一个 Map 来存储节点 ID 到 Y 位置的映射关系
  const positions = new Map(mappedNodes.map((node) => [node.id, node.y]));
  // 计算高亮区域的高度，限制在 0-1 范围内
  const highlightHeight = Math.max(0, Math.min(1, progress));
  const heroPathProgress = Math.min(1, Math.max(0, progress));

  return (
    // 主容器，包含整个引导轴
    <div
      ref={railRef}
      className={cn(
        "relative flex-1",
        mode === "hero" ? "h-[70vh] min-h-[420px]" : "h-[60vh] min-h-[360px]"
      )}
      aria-hidden
      data-guide-mode={mode}
    >
      {/* 金缮轨道背景（所有模式可见） */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <svg
          viewBox="0 0 120 1000"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full text-primary/60"
          aria-hidden
        >
          {!reduced && (
            <motion.path
              d={heroPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 0.4, opacity: 1 }}
              transition={{
                delay: motionTokens.ultra.lineDrawDelay,
                duration: motionTokens.ultra.lineDrawDuration,
                ease: motionTokens.easing.easeOut,
              }}
              className="text-primary/60"
            />
          )}
          <motion.path
            d={heroPathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            style={{
              pathLength: heroPathProgress,
              opacity: reduced ? 0.6 : 1,
            }}
            transition={{
              duration: reduced ? 0 : 0.4,
              ease: motionTokens.easing.easeOut,
            }}
          />
        </svg>
      </div>

      {/* 引导轴的视觉表示，包含基础线条和高亮部分 */}

      {/* 渲染每个导航节点 */}
      {nodes.map((node) => {
        // 检查当前节点是否为活跃节点
        const isActive = node.id === activeId;
        // 检查节点是否已被访问
        const isVisited = Boolean(node.meta?.visited);
        // 检查节点是否被禁用
        const isDisabled = Boolean(node.meta?.disabled);
        // 根据节点级别确定基础半径
        const baselineRadius = node.level === 2 ? guideRailTokens.dimension.nodeRadius.sub : guideRailTokens.dimension.nodeRadius.default;
        // 如果节点活跃，则使用更大的半径
        const radius = isActive ? guideRailTokens.dimension.nodeRadius.active : baselineRadius;
        // 计算直径
        const diameter = radius * 2;
        // 获取节点的原始 Y 位置
        const rawY = positions.get(node.id) ?? 0;
        // 计算节点的顶部位置，确保在合理范围内
        const topValue = Math.min(Math.max(rawY, 0), Math.max(railHeight, diameter));

        return (
          <div
            key={node.id}
            className="absolute left-1/2 z-20 -translate-x-1/2"
            style={{ top: `${topValue}px` }}
          >
            {/* 导航节点按钮 */}
            <button
              type="button"
              onClick={() => !isDisabled && goTo(node)}
              disabled={isDisabled}
              className={cn(
                "pointer-events-auto rounded-full border",
                "transition-opacity duration-150",
                isActive ? "border-transparent" : "border-transparent",
                isDisabled ? "opacity-30" : "opacity-60 hover:opacity-90",
                isActive && "opacity-100"
              )}
              style={{
                width: `${diameter}px`,
                height: `${diameter}px`,
                background: isActive ? guideRailTokens.colors.nodeActive : isVisited ? guideRailTokens.colors.nodeVisited : guideRailTokens.colors.node,
                boxShadow: isActive ? "0 0 0 2px rgba(255,255,255,0.3)" : undefined,
              }}
              aria-label={node.meta?.subtitle ?? node.label}
              aria-current={isActive ? "true" : undefined}
              data-state={isDisabled ? "disabled" : isActive ? "active" : isVisited ? "visited" : "default"}
              title={node.meta?.subtitle ?? node.label}
            />
            {showLabels && (
              <span
                className={cn(
                  "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3 text-[0.6rem] uppercase tracking-[0.35em]",
                  isActive ? "text-foreground" : "text-muted-foreground/80"
                )}
              >
                {node.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
