import Container from "@/components/shell/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCommentsLoading() {
  return (
    <main className="py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <Skeleton className="h-24 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-14 w-full rounded-[var(--radius)]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`queue-${index}`} className="h-24 w-full rounded-[var(--radius)]" />
            ))}
          </div>
          <Skeleton className="h-[420px] w-full rounded-[var(--radius)]" />
        </div>
      </Container>
    </main>
  );
}
