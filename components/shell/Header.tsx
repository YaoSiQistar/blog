"use client";

import { useEffect, useState } from "react";
import { useScroll } from "motion/react";
import { usePathname } from "next/navigation";

import AnimatedLink from "@/components/motion/AnimatedLink";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { siteConfig } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/posts" },
  { label: "分类", href: "/categories" },
  { label: "标签", href: "/tags" },
  { label: "搜索", href: "/search" },
  { label: "关于", href: "/about" },
  { label: "我的", href: "/me" },
  { label: "登录", href: "/login" }
];

type HeaderVariant = "default" | "hero";

interface HeaderProps {
  variant?: HeaderVariant;
}

export default function Header({ variant = "default" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useEffect(() => {
    const threshold = motionTokens.header.threshold;
    const handleScroll = (value: number) => {
      setIsScrolled(value > threshold);
    };

    handleScroll(scrollY.get());
    const unsubscribe = scrollY.on("change", handleScroll);
    return () => unsubscribe();
  }, [scrollY]);

  const heroHint = variant === "hero" && !isScrolled;
  const baseClass = cn(
    "fixed inset-x-0 top-0 z-40 border-b transition",
    "backdrop-blur-[10px] backdrop-saturate-150",
    isScrolled
      ? "border-border bg-card/90 shadow-[0_35px_45px_-40px_rgba(0,0,0,0.35)]"
      : heroHint
      ? "border-transparent bg-background/10"
      : "border-transparent bg-background/20"
  );

  const transitionStyle = {
    transition: reduced
      ? undefined
      : `background-color ${motionTokens.durations.fast}s ${motionTokens.toCssEasing(
          motionTokens.easing.easeOut
        )}, border-color ${motionTokens.durations.fast}s ${motionTokens.toCssEasing(
          motionTokens.easing.easeOut
        )}`,
  };

  return (
    <header className={baseClass} style={transitionStyle}>
      <div className="mx-auto flex min-h-[5.25rem] max-w-[var(--container-wide)] items-center justify-between px-[var(--gutter)]">
        <AnimatedLink
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.4em]"
          underlineThickness={1}
          underlineOffset={-4}
        >
          {siteConfig.siteName}
        </AnimatedLink>

        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.25em]">
          {navLinks.map((link) => (
            <AnimatedLink key={link.href} href={link.href}>
              <span
                className={cn(
                  pathname === link.href ? "text-primary" : "text-muted-foreground",
                  "transition-colors"
                )}
              >
                {link.label}
              </span>
            </AnimatedLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
