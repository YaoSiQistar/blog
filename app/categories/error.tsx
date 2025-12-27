"use client";

import Link from "next/link";

import Container from "@/components/shell/Container";
import { Button } from "@/components/ui/button";

type CategoriesErrorProps = {
  error: Error;
  reset: () => void;
};

export default function CategoriesError({ error, reset }: CategoriesErrorProps) {
  console.error(error);
  return (
    <Container variant="wide" className="py-[var(--section-y)]">
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
          博物馆离线
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          展厅暂时不可用。
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          可重试或返回首页。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset}>重试</Button>
          <Button asChild variant="secondary">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
