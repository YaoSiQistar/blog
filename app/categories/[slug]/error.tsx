"use client";

import Link from "next/link";

import Container from "@/components/shell/Container";
import { Button } from "@/components/ui/button";

type CategoryDetailErrorProps = {
  error: Error;
  reset: () => void;
};

export default function CategoryDetailError({ error, reset }: CategoryDetailErrorProps) {
  console.error(error);
  return (
    <Container variant="wide" className="py-[var(--section-y)]">
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
          Gallery Closed
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          This gallery is temporarily unavailable.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Retry or return to the galleries.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button asChild variant="secondary">
            <Link href="/categories">Back to galleries</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
