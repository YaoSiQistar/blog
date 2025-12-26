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
          <DialogTitle>Login required</DialogTitle>
          <DialogDescription>
            Sign in to save this post to your personal collection.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button asChild>
            <Link href={href}>Go to login</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
