"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
};

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  autoFocus,
  className,
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          className="pr-11"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
