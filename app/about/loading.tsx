import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <main className="relative py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide" className="space-y-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-44 w-full rounded-[var(--radius-2xl)]" />
        </div>
        <Skeleton className="h-16 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-56 w-full rounded-[var(--radius)]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-[var(--radius-xl)]" />
          ))}
        </div>
      </Container>
    </main>
  );
}
