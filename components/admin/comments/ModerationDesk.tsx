"use client";

import * as React from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import DeskHeader from "./DeskHeader";
import FiltersBar, { type ModerationFilters } from "./FiltersBar";
import QueueList from "./QueueList";
import ReviewPanel from "./ReviewPanel";
import BulkActionBar from "./BulkActionBar";
import HotkeysDialog from "./HotkeysDialog";
import { useHotkeys } from "./useHotkeys";

import type { AdminBatchAction, AdminCommentItem, AdminCommentStats } from "@/lib/admin/types";
import type { PostsIndexMap } from "@/lib/content/postsIndex";
import { cn } from "@/lib/utils";

const defaultFilters: ModerationFilters = {
  status: "pending",
  q: "",
  sort: "newest",
  page: 1,
  pageSize: 20,
};

type ModerationDeskProps = {
  postIndex: PostsIndexMap;
};

export default function ModerationDesk({ postIndex }: ModerationDeskProps) {
  const [filters, setFilters] = React.useState<ModerationFilters>(defaultFilters);
  const [items, setItems] = React.useState<AdminCommentItem[]>([]);
  const [stats, setStats] = React.useState<AdminCommentStats>({
    pending: 0,
    approved: 0,
    hidden: 0,
  });
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [hotkeysOpen, setHotkeysOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const selectedItem = items.find((item) => item.id === selectedId);
  const selectedIndex = selectedId
    ? items.findIndex((item) => item.id === selectedId)
    : -1;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  const fetchComments = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("status", filters.status);
      if (filters.q) params.set("q", filters.q);
      params.set("page", String(filters.page));
      params.set("pageSize", String(filters.pageSize));
      params.set("sort", filters.sort);

      const response = await fetch(`/api/admin/comments?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "无法加载评论。");
      }
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setStats((prev) => data.stats ?? prev);

      if (data.items?.length && (!selectedId || !data.items.find((i: AdminCommentItem) => i.id === selectedId))) {
        setSelectedId(data.items[0]?.id);
      }
      setSelectedIds((prev) => {
        const next = new Set<string>();
        (data.items ?? []).forEach((item: AdminCommentItem) => {
          if (prev.has(item.id)) next.add(item.id);
        });
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "无法加载评论。";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedId]);

  React.useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const updateFilters = (next: Partial<ModerationFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectRow = (id: string) => {
    setSelectedId(id);
    setPanelOpen(true);
  };

  const adjustStats = (updates: AdminCommentItem[], action: AdminBatchAction) => {
    setStats((prev) => {
      let pending = prev.pending;
      let approved = prev.approved;
      let hidden = prev.hidden;

      updates.forEach((item) => {
        if (item.status === "pending") pending -= 1;
        if (item.status === "approved") approved -= 1;
        if (item.status === "hidden") hidden -= 1;
      });

      if (action === "approve") approved += updates.length;
      if (action === "hide") hidden += updates.length;

      return {
        pending: Math.max(0, pending),
        approved: Math.max(0, approved),
        hidden: Math.max(0, hidden),
      };
    });
  };

  const applyAction = async (ids: string[], action: AdminBatchAction) => {
    if (!ids.length) return;
    const updateTargets = items.filter((item) => ids.includes(item.id));
    adjustStats(updateTargets, action);

    const nextStatus: AdminCommentItem["status"] =
      action === "approve" ? "approved" : action === "hide" ? "hidden" : "spam";
    setItems((prev) => {
      const next = prev.map((item) =>
        ids.includes(item.id) ? { ...item, status: nextStatus } : item
      );
      if (filters.status === "pending") {
        return next.filter((item) => item.status === "pending");
      }
      if (filters.status === "approved") {
        return next.filter((item) => item.status === "approved");
      }
      if (filters.status === "hidden") {
        return next.filter((item) => item.status === "hidden");
      }
      return next;
    });

    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });

    if (selectedId && ids.includes(selectedId)) {
      const nextItem = items[selectedIndex + 1] ?? items[selectedIndex - 1];
      setSelectedId(nextItem?.id);
    }

    try {
      const response = await fetch("/api/admin/comments/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Update failed.");
      }
      toast.success(`已更新 ${data.updated ?? ids.length} 条评论。`);
      fetchComments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败。");
      fetchComments();
    }
  };

  const goNext = () => {
    if (selectedIndex < 0) return;
    const next = items[selectedIndex + 1] ?? items[0];
    if (next) selectRow(next.id);
  };

  const goPrev = () => {
    if (selectedIndex < 0) return;
    const prev = items[selectedIndex - 1] ?? items[items.length - 1];
    if (prev) selectRow(prev.id);
  };

  useHotkeys(true, {
    onNext: goNext,
    onPrev: goPrev,
    onApprove: () => selectedId && applyAction([selectedId], "approve"),
    onHide: () => selectedId && applyAction([selectedId], "hide"),
    onToggleSelect: () => selectedId && toggleSelect(selectedId),
    onToggleHelp: () => setHotkeysOpen((prev) => !prev),
    onEscape: () => {
      setPanelOpen(false);
      setSelectedIds(new Set());
    },
  });

  const bulkCount = selectedIds.size;

  return (
    <div className="space-y-6">
      <DeskHeader
        pending={stats.pending}
        approved={stats.approved}
        hidden={stats.hidden}
        onRefresh={fetchComments}
        onClearKey={() => {
          window.location.href = "/api/admin/gate?clear=1&redirect=/admin/comments";
        }}
        hotkeysSlot={<HotkeysDialog open={hotkeysOpen} onOpenChange={setHotkeysOpen} />}
      />

      <FiltersBar filters={filters} onChange={updateFilters} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
            <span>队列</span>
            <span>
              {filters.page} / {totalPages}
            </span>
          </div>

          {loading ? (
            <div className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground">
              正在加载队列...
            </div>
          ) : error ? (
            <div className="rounded-[var(--radius)] border border-destructive/40 bg-card/70 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <>
              <QueueList
                items={items}
                selectedId={selectedId}
                selectedIds={selectedIds}
                postIndex={postIndex}
                onSelect={selectRow}
                onToggle={toggleSelect}
                onQuickAction={(id, action) => applyAction([id], action)}
              />
              <div className="flex items-center justify-between pt-2 text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
                <span>共 {total} 条</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border border-border px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em]",
                      filters.page > 1 ? "hover:border-primary/50" : "opacity-40"
                    )}
                    onClick={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
                    disabled={filters.page <= 1}
                  >
                    上一页
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border border-border px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em]",
                      filters.page < totalPages ? "hover:border-primary/50" : "opacity-40"
                    )}
                    onClick={() => updateFilters({ page: Math.min(totalPages, filters.page + 1) })}
                    disabled={filters.page >= totalPages}
                  >
                    下一页
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden lg:block">
          <ReviewPanel
            item={selectedItem}
            postTitle={selectedItem ? postIndex[selectedItem.post_slug]?.title : undefined}
            onAction={(action) => selectedId && applyAction([selectedId], action)}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={selectedIndex >= 0 && selectedIndex < items.length - 1}
            hasPrev={selectedIndex > 0}
          />
        </div>
      </div>

      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent side="right" className="p-4">
          <SheetHeader>
            <SheetTitle>Review</SheetTitle>
          </SheetHeader>
          <ReviewPanel
            item={selectedItem}
            postTitle={selectedItem ? postIndex[selectedItem.post_slug]?.title : undefined}
            onAction={(action) => selectedId && applyAction([selectedId], action)}
            onNext={goNext}
            onPrev={goPrev}
            onClose={() => setPanelOpen(false)}
            hasNext={selectedIndex >= 0 && selectedIndex < items.length - 1}
            hasPrev={selectedIndex > 0}
          />
        </SheetContent>
      </Sheet>

      <BulkActionBar
        count={bulkCount}
        visible={bulkCount > 0}
        onApprove={() => applyAction(Array.from(selectedIds), "approve")}
        onHide={() => applyAction(Array.from(selectedIds), "hide")}
        onSpam={() => applyAction(Array.from(selectedIds), "spam")}
        onClear={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
