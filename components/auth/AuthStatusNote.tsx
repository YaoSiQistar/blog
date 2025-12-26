"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Circle, Stamp } from "lucide-react";

type AuthStatusNoteProps = {
  tone?: "error" | "success";
  title: string;
  message: string;
};

export default function AuthStatusNote({ tone = "error", title, message }: AuthStatusNoteProps) {
  const isError = tone === "error";
  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      className={cn(
        "border bg-card/80",
        isError
          ? "border-destructive/30 bg-[rgba(226,79,79,0.08)] text-destructive"
          : "border-emerald-500/20 bg-[rgba(34,197,94,0.1)] text-emerald-800 dark:text-emerald-300"
      )}
    >
      {isError ? <Circle className="size-2 text-destructive" /> : <Stamp />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
