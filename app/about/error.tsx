"use client";

import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import { Button } from "@/components/ui/button";

type AboutErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AboutError({ reset }: AboutErrorProps) {
  return (
    <main className="relative py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide">
        <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            关于资料无法加载。
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={reset}>重试</Button>
            <Button variant="secondary" asChild>
              <a href="/">返回首页</a>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
