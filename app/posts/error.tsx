"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-4 py-[var(--section-y)] text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
        展厅已关闭
      </p>
      <h1 className="text-2xl font-semibold text-foreground">
        归档暂时不可用。
      </h1>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
