import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeLoading() {
  return (
    <main className="relative py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide" className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-[var(--radius)]" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-[var(--radius)]" />
          ))}
        </div>
      </Container>
    </main>
  );
}
