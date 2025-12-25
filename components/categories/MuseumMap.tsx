"use client";

import { motion } from "motion/react";
import * as React from "react";

import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import type { CategoryEdge, CategoryNode } from "@/lib/categories/mapModel";

type MuseumMapProps = {
  nodes: CategoryNode[];
  edges: CategoryEdge[];
  activeSlug?: string | null;
  selectedSlug?: string | null;
  onHover?: (slug: string | null) => void;
  onSelect?: (slug: string) => void;
  onClear?: () => void;
};

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 640;
const LABEL_LIMIT = 8;

export default function MuseumMap({
  nodes,
  edges,
  activeSlug,
  selectedSlug,
  onHover,
  onSelect,
  onClear,
}: MuseumMapProps) {
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const nodeMap = React.useMemo(
    () => new Map(nodes.map((node) => [node.slug, node])),
    [nodes]
  );

  const labelSlugs = React.useMemo(() => {
    const top = [...nodes]
      .sort((a, b) => b.count - a.count)
      .slice(0, LABEL_LIMIT)
      .map((node) => node.slug);
    const set = new Set(top);
    if (activeSlug) set.add(activeSlug);
    if (selectedSlug) set.add(selectedSlug);
    return set;
  }, [activeSlug, nodes, selectedSlug]);

  const handleBackgroundPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.target === event.currentTarget) {
      onClear?.();
    }
  };

  return (
    <motion.svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="Museum map of categories"
      onPointerDown={handleBackgroundPointerDown}
      initial={{ opacity: reduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduced ? 0 : motionTokens.durations.normal,
        ease: motionTokens.easing.easeOut,
      }}
    >
      <defs>
        <filter id="map-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map((edge, index) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        const isActive =
          edge.from === activeSlug ||
          edge.to === activeSlug ||
          edge.from === selectedSlug ||
          edge.to === selectedSlug;
        const strokeOpacity = isActive ? 0.45 : Math.max(0.12, edge.weight * 0.5);
        const strokeWidth = isActive ? 1.4 : 0.8;
        return (
          <motion.line
            key={`${edge.from}-${edge.to}`}
            x1={from.x * MAP_WIDTH}
            y1={from.y * MAP_HEIGHT}
            x2={to.x * MAP_WIDTH}
            y2={to.y * MAP_HEIGHT}
            stroke="var(--primary)"
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ pointerEvents: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduced ? 0 : index * 0.01,
              duration: reduced ? 0 : motionTokens.durations.fast,
              ease: motionTokens.easing.easeOut,
            }}
          />
        );
      })}

      {nodes.map((node, index) => {
        const isActive = node.slug === activeSlug;
        const isSelected = node.slug === selectedSlug;
        const showLabel = labelSlugs.has(node.slug);
        const baseRadius = 3.5 + node.size * 6;
        const radius = isSelected ? baseRadius + 2.5 : isActive ? baseRadius + 1 : baseRadius;
        const centerX = node.x * MAP_WIDTH;
        const centerY = node.y * MAP_HEIGHT;

        return (
          <motion.g
            key={node.slug}
            tabIndex={0}
            role="button"
            aria-label={`${node.name}, ${node.count} posts`}
            aria-pressed={isSelected}
            focusable="true"
            onMouseEnter={() => onHover?.(node.slug)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(node.slug)}
            onBlur={() => onHover?.(null)}
            onClick={() => onSelect?.(node.slug)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(node.slug);
              }
              if (event.key === "Escape") {
                onClear?.();
              }
            }}
            style={{ cursor: "pointer" }}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduced ? 0 : index * 0.02,
              duration: reduced ? 0 : motionTokens.durations.fast,
              ease: motionTokens.easing.easeOut,
            }}
          >
            {isSelected ? (
              <circle
                cx={centerX}
                cy={centerY}
                r={radius + 6}
                fill="var(--primary)"
                opacity={0.12}
                filter="url(#map-glow)"
              />
            ) : null}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill={isActive || isSelected ? "var(--primary)" : "var(--border)"}
              fillOpacity={isActive || isSelected ? 0.8 : 0.35}
              stroke="var(--primary)"
              strokeOpacity={isActive || isSelected ? 0.7 : 0.25}
              strokeWidth={isActive || isSelected ? 1.2 : 0.8}
            />
            <text
              x={centerX + radius + 6}
              y={centerY + 4}
              fontSize="12"
              fill="var(--foreground)"
              fillOpacity={showLabel ? 0.65 : 0}
              style={{ pointerEvents: "none" }}
            >
              {node.name}
            </text>
          </motion.g>
        );
      })}
    </motion.svg>
  );
}
