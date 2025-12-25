import Container from "@/components/shell/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-[360px]" />
          <Skeleton className="h-4 w-[520px]" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-12 w-full rounded-[var(--radius)] border border-border" />
      </Container>

      <Container variant="wide">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <Skeleton className="h-[520px] w-full rounded-[var(--radius)] border border-border" />
          </div>
          <Skeleton className="h-[420px] w-full rounded-[var(--radius)] border border-border lg:h-[520px]" />
        </div>
      </Container>
    </main>
  );
}
