import Link from "next/link";

import Container from "@/components/shell/Container";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <Container variant="wide" className="py-[var(--section-y)]">
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
          展厅不存在
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          该展厅不存在。
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          返回展厅地图继续探索。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/categories">返回展厅列表</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/posts">浏览全部文章</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
