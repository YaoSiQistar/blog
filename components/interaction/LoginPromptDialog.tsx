"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type LoginPromptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo: string;
};

export default function LoginPromptDialog({
  open,
  onOpenChange,
  redirectTo,
}: LoginPromptDialogProps) {
  const href = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>需要登录</DialogTitle>
          <DialogDescription>
            登录后即可将此文章保存到个人收藏。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            暂不
          </Button>
          <Button asChild>
            <Link href={href}>前往登录</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
