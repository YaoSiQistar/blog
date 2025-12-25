"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { CategoryNode } from "@/lib/categories/mapModel";
import MapPlaque from "./MapPlaque";

type MobileMapSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node?: CategoryNode | null;
};

export default function MobileMapSheet({ open, onOpenChange, node }: MobileMapSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Gallery Plaque
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          {node ? (
            <MapPlaque node={node} variant="sheet" />
          ) : (
            <div className="rounded-[var(--radius)] border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
              Select a gallery node to see details.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
