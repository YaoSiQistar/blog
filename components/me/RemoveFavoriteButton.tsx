"use client";

import * as React from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RemoveFavoriteButtonProps = {
  postSlug: string;
  onRemove: () => void;
  onUndo: () => void;
  className?: string;
};

export default function RemoveFavoriteButton({
  postSlug,
  onRemove,
  onUndo,
  className,
}: RemoveFavoriteButtonProps) {
  const [pending, setPending] = React.useState(false);

  const handleRemove = async () => {
    if (pending) return;
    setPending(true);
    onRemove();

    let undone = false;
    const undo = async () => {
      if (undone) return;
      undone = true;
      onUndo();
      try {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postSlug, action: "add" }),
        });
        if (!response.ok) {
          toast.error("无法恢复收藏。");
        }
      } catch (error) {
        console.error(error);
        toast.error("无法恢复收藏。");
      }
    };

    toast("已从收藏中移除。", {
      action: {
        label: "撤销",
        onClick: () => {
          void undo();
        },
      },
    });

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, action: "remove" }),
      });
      if (!response.ok) {
        if (!undone) onUndo();
        toast.error("无法移除收藏。");
      }
    } catch (error) {
      console.error(error);
      if (!undone) onUndo();
      toast.error("无法移除收藏。");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={pending}
      className={cn(
        "h-7 px-2 text-[0.6rem] uppercase tracking-[0.3em]",
        "opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100",
        className
      )}
    >
      <Trash2 className="size-3.5" />
      移除
    </Button>
  );
}
