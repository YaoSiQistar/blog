import Container from "@/components/shell/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function TagDetailLoading() {
  return (
    <main className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-[360px]" />
          <Skeleton className="h-4 w-[520px]" />
        </div>
        <Skeleton className="h-10 w-full rounded-[var(--radius)] border border-border" />
      </Container>

      <Container variant="wide" className="space-y-6">
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-12 w-full rounded-[var(--radius)] border border-border" />
      </Container>

      <Container variant="wide" className="space-y-5">
        <Skeleton className="h-px w-full" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="rounded-[var(--radius)] border border-border bg-card/70 p-6"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-6 w-2/3" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </div>
        ))}
      </Container>
    </main>
  );
}
