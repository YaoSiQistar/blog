import Link from "next/link";

import Container from "@/components/shell/Container";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <Container variant="wide" className="py-[var(--section-y)]">
      <div className="rounded-[var(--radius)] border border-border bg-card/70 p-8">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-muted-foreground">
          Gallery Missing
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          This gallery does not exist.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Return to the museum map to continue exploring.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/categories">Back to galleries</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/posts">Browse all posts</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
