import Container from "@/components/shell/Container";

export default function ShareLoading() {
  return (
    <main className="py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded-full bg-muted/60" />
          <div className="h-8 w-2/3 rounded-full bg-muted/60" />
          <div className="h-4 w-1/2 rounded-full bg-muted/40" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="aspect-[1200/630] rounded-[var(--radius)] border border-border bg-muted/40" />
          <div className="space-y-4">
            <div className="h-12 rounded-[var(--radius)] border border-border bg-muted/30" />
            <div className="h-48 rounded-[var(--radius)] border border-border bg-muted/30" />
          </div>
        </div>
      </Container>
    </main>
  );
}
