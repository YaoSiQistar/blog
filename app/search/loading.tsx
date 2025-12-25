import Container from "@/components/shell/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-[360px]" />
          <Skeleton className="h-4 w-[520px]" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-3 rounded-[var(--radius)] border border-border bg-card/70 p-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </Container>

      <Container variant="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-[var(--radius)] border border-border bg-card/70 p-6"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-4 h-6 w-2/3" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-[420px] w-full rounded-[var(--radius)] border border-border" />
          </div>
        </div>
      </Container>
    </main>
  );
}
