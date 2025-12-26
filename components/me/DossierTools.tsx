"use client";

import * as React from "react";
import { Copy, Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";
import { useReducedMotion } from "@/lib/motion/reduced";
import { useMotionFlags } from "@/lib/flags";
import {
  buildDossierHref,
  normalizeDossierState,
  parseDossierParams,
  resetPageOnChange,
  type DossierQueryState,
} from "@/lib/me/query";

export default function DossierTools() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const flags = useMotionFlags();
  const reduced = reducedMotion || flags.reduced;
  const current = React.useMemo(() => parseDossierParams(searchParams), [searchParams]);
  const [queryValue, setQueryValue] = React.useState(current.q ?? "");
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setQueryValue(current.q ?? "");
  }, [current.q]);

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const commitState = React.useCallback((next: DossierQueryState, replace = false) => {
    const normalized = normalizeDossierState(next);
    const href = buildDossierHref(normalized);
    if (replace) router.replace(href);
    else router.push(href);
  }, [router]);

  const updateState = React.useCallback((partial: Partial<DossierQueryState>, replace = false) => {
    const next = resetPageOnChange(current, { ...current, ...partial });
    commitState(next, replace);
  }, [commitState, current]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = queryValue.trim();
    updateState({ q: trimmed || undefined }, false);
  };

  const handleClear = () => {
    setQueryValue("");
    updateState({ q: undefined }, false);
  };

  const handleSortChange = (value: string) => {
    if (!value) return;
    updateState({ sort: value as DossierQueryState["sort"] });
  };

  const handleViewChange = (value: string) => {
    if (!value) return;
    updateState({ view: value as DossierQueryState["view"] });
  };

  const handleReset = () => {
    setQueryValue("");
    commitState({
      tab: current.tab,
      sort: "saved",
      q: undefined,
      page: 1,
      view: "list",
    });
  };

  const handleCopy = async () => {
    try {
      const href = buildDossierHref(current);
      const url = `${window.location.origin}${href}`;
      await navigator.clipboard.writeText(url);
      toast.success("Dossier link copied.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy link.");
    }
  };

  const isFavorites = current.tab === "favorites";

  return (
    <div className="space-y-4">
      <motion.form
        variants={fadeUp(reduced)}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card/70 p-4"
        )}
      >
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-border-subtle bg-background/70 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={queryValue}
            onChange={(event) => setQueryValue(event.target.value)}
            placeholder={isFavorites ? "Search favorites" : "Search dossier"}
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            aria-label="Search dossier"
            disabled={!isFavorites}
          />
          {queryValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
              disabled={!isFavorites}
            >
              <X className="size-3" />
            </button>
          ) : null}
        </div>

        <Button type="submit" className="rounded-full" disabled={!isFavorites}>
          Search
        </Button>

        <div className="hidden items-center gap-3 lg:flex">
          <Select value={current.sort} onValueChange={handleSortChange} disabled={!isFavorites}>
            <SelectTrigger className="w-[170px] rounded-full text-xs uppercase tracking-[0.3em]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saved">Latest saved</SelectItem>
              <SelectItem value="published">Latest published</SelectItem>
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            value={current.view}
            onValueChange={handleViewChange}
            className="rounded-full border border-border-subtle bg-background/70 p-1"
          >
            <ToggleGroupItem value="list" className="px-3 text-xs uppercase tracking-[0.3em]">
              List
            </ToggleGroupItem>
            <ToggleGroupItem value="compact" className="px-3 text-xs uppercase tracking-[0.3em]">
              Compact
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" variant="ghost" onClick={handleCopy}>
            <Copy className="mr-2 size-4" />
            Copy link
          </Button>
        </div>

        <div className="ml-auto lg:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="secondary">
                <SlidersHorizontal className="mr-2 size-4" />
                Tools
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Dossier tools</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sort</p>
                  <Select value={current.sort} onValueChange={handleSortChange} disabled={!isFavorites}>
                    <SelectTrigger className="w-full rounded-full text-xs uppercase tracking-[0.3em]">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Latest saved</SelectItem>
                      <SelectItem value="published">Latest published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">View</p>
                  <ToggleGroup
                    type="single"
                    value={current.view}
                    onValueChange={handleViewChange}
                    className="rounded-full border border-border-subtle bg-background/70 p-1"
                  >
                    <ToggleGroupItem value="list" className="px-3 text-xs uppercase tracking-[0.3em]">
                      List
                    </ToggleGroupItem>
                    <ToggleGroupItem value="compact" className="px-3 text-xs uppercase tracking-[0.3em]">
                      Compact
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleCopy}>
                    <Copy className="mr-2 size-4" />
                    Copy link
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.form>

      {!isFavorites ? (
        <p className="text-xs text-muted-foreground">
          Filters apply to favorites. Activity tabs update automatically.
        </p>
      ) : null}
    </div>
  );
}
