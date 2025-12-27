"use client";

import * as React from "react";

import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import { Button } from "@/components/ui/button";

type MeErrorProps = {
  error: Error;
  reset: () => void;
};

export default function MeError({ reset }: MeErrorProps) {
  return (
    <main className="relative py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide">
        <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            档案暂时不可用。
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={reset}>重试</Button>
            <Button variant="secondary" asChild>
              <a href="/posts">浏览文章</a>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
