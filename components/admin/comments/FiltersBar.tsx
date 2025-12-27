import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type ModerationStatus = "pending" | "approved" | "hidden" | "all";
export type ModerationSort = "newest" | "oldest";

export type ModerationFilters = {
  status: ModerationStatus;
  q: string;
  sort: ModerationSort;
  page: number;
  pageSize: number;
};

const statusLabels: Record<ModerationStatus, string> = {
  pending: "待审",
  approved: "已通过",
  hidden: "已隐藏",
  all: "全部",
};

type FiltersBarProps = {
  filters: ModerationFilters;
  onChange: (next: Partial<ModerationFilters>) => void;
  className?: string;
};

const FilterContent = ({
  filters,
  onChange,
  compact = false,
}: FiltersBarProps & { compact?: boolean }) => {
  const [draft, setDraft] = React.useState(filters.q);

  React.useEffect(() => {
    setDraft(filters.q);
  }, [filters.q]);

  const commitSearch = () => {
    onChange({ q: draft.trim(), page: 1 });
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", compact && "flex-col items-stretch")}>
      <Tabs
        value={filters.status}
        onValueChange={(value) => onChange({ status: value as ModerationStatus, page: 1 })}
      >
        <TabsList className="rounded-full border border-border-subtle bg-background/70">
          {["pending", "approved", "hidden", "all"].map((status) => (
            <TabsTrigger key={status} value={status} className="text-xs uppercase tracking-[0.3em]">
              {statusLabels[status as ModerationStatus]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className={cn("flex flex-1 items-center gap-2", compact && "w-full")}>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitSearch();
            }
          }}
          placeholder="搜索昵称、内容或 slug"
          className="h-9"
        />
        <Button variant="secondary" size="sm" onClick={commitSearch}>
          搜索
        </Button>
      </div>

      <Select
        value={filters.sort}
        onValueChange={(value) => onChange({ sort: value as ModerationSort, page: 1 })}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="排序" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">最新</SelectItem>
          <SelectItem value="oldest">最早</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={String(filters.pageSize)}
        onValueChange={(value) => onChange({ pageSize: Number(value), page: 1 })}
      >
        <SelectTrigger className="h-9 w-[120px]">
          <SelectValue placeholder="每页数量" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="20">20 / 页</SelectItem>
          <SelectItem value="50">50 / 页</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default function FiltersBar({ filters, onChange, className }: FiltersBarProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius)] border border-border/70 bg-card/70 px-4 py-3",
        className
      )}
    >
      <div className="hidden lg:block">
        <FilterContent filters={filters} onChange={onChange} />
      </div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">筛选</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="space-y-4">
            <SheetHeader>
              <SheetTitle>筛选</SheetTitle>
            </SheetHeader>
            <FilterContent filters={filters} onChange={onChange} compact />
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
