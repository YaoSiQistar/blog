import Link from "next/link";

import Container from "@/components/shell/Container";
import { Button } from "@/components/ui/button";

export default function TagNotFound() {
  return (
    <Container variant="wide" className="py-[var(--section-y)]">
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
          专题不存在
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          该标签专题不存在。
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          返回标签墙继续探索。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/tags">返回标签</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/posts">浏览全部文章</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
