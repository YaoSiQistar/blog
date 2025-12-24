import { Skeleton } from "@/components/ui/skeleton";

function PanelSkeleton() {
  return (
    <div className="space-y-4 rounded-[var(--radius)] border border-border bg-card/70 p-5">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-[var(--radius)]" />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block">
            <PanelSkeleton />
          </aside>
          <div className="space-y-6">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-16 w-full" />
            <CatalogSkeleton />
          </div>
          <aside className="hidden lg:block">
            <PanelSkeleton />
          </aside>
        </div>
      </div>
    </div>
  );
}
