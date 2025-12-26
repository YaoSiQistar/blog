"use client";

import Link from "next/link";

import SheenHover from "@/components/motion/SheenHover";
import { cn } from "@/lib/utils";

type AboutCTA = {
  label: string;
  href: string;
};

type AboutCTAsProps = {
  primary?: AboutCTA;
  secondary?: AboutCTA;
  tertiary?: AboutCTA;
};

export default function AboutCTAs({ primary, secondary, tertiary }: AboutCTAsProps) {
  const cards = [primary, secondary, tertiary].filter(Boolean) as AboutCTA[];
  if (!cards.length) return null;

  return (
    <section className="space-y-4">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        Exit points
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.slice(0, 2).map((cta) => (
          <SheenHover key={cta.href} className="rounded-[var(--radius-xl)]">
            <Link
              href={cta.href}
              className={cn(
                "flex h-full flex-col justify-between gap-4 rounded-[var(--radius-xl)] border border-border/70 bg-card/70 px-5 py-5 text-sm transition",
                "hover:border-primary/40 hover:bg-card/90"
              )}
            >
              <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
                Guide
              </span>
              <span className="text-lg font-semibold text-foreground">{cta.label}</span>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Enter
              </span>
            </Link>
          </SheenHover>
        ))}
      </div>
    </section>
  );
}
