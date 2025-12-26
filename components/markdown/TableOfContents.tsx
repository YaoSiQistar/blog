"use client";

import { useEffect, useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AnimatedLink from "@/components/motion/AnimatedLink";

import type { HeadingNode } from "@/lib/posts/types";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  headings: HeadingNode[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-40% 0px -60% 0px",
        threshold: 0,
      }
    );

    const observed: HTMLElement[] = [];
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (!element) return;
      observer.observe(element);
      observed.push(element);
    });

    return () => {
      observer.disconnect();
      observed.forEach((element) => observer.unobserve(element));
    };
  }, [headings]);

  const renderList = () => (
    <div className="space-y-3">
      <div className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
        On this page
      </div>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          const indent =
            heading.depth === 4 ? "pl-6" : heading.depth === 3 ? "pl-4" : "pl-1";
          return (
            <li key={heading.id}>
              <AnimatedLink
                href={`#${heading.id}`}
                className={cn(
                  "block w-full rounded-full px-3 py-1 text-[0.85rem] leading-snug transition",
                  indent,
                  isActive
                    ? "bg-card text-foreground shadow-[inset_0_0_0_1px_rgba(13,59,102,0.25)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                )}
              >
                {heading.text}
              </AnimatedLink>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <div className="hidden space-y-4 rounded-(--radius) border border-border/70 bg-card/60 p-4 lg:block lg:sticky lg:top-[6.75rem] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
        {renderList()}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Contents
          </button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Contents</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">{renderList()}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
