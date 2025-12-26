"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

import AuthPlaqueHeader from "@/components/auth/AuthPlaqueHeader";
import AuthStatusNote from "@/components/auth/AuthStatusNote";
import PasswordField from "@/components/auth/PasswordField";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseClient } from "@/lib/supabase/client";
import { mapSupabaseError } from "@/lib/auth/errors";
import { registerSchema } from "@/lib/auth/validators";
import { resolveRedirect } from "@/lib/auth/redirect";
import type { AuthMode } from "@/components/auth/AuthFlipPage";

type RegisterPaneProps = {
  redirectTo?: string | null;
  onSwitchMode: (mode: AuthMode) => void;
};

export default function RegisterPane({ redirectTo, onSwitchMode }: RegisterPaneProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [pending, setPending] = React.useState(false);
  const [status, setStatus] = React.useState<{
    tone: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});
    setStatus(null);

    const parsed = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) {
          nextErrors[String(issue.path[0])] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setPending(false);
      return;
    }

    try {
      const supabase = createSupabaseClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const emailRedirectTo = origin
        ? `${origin}/login?verified=1&redirectTo=${encodeURIComponent(
            resolveRedirect(redirectTo)
          )}`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      });
      if (error) {
        const message = mapSupabaseError(error) ?? "Unable to create account.";
        setStatus({ tone: "error", title: "Request denied", message });
        return;
      }

      if (data.session) {
        const destination = resolveRedirect(redirectTo);
        router.push(destination);
        router.refresh();
      } else {
        setStatus({
          tone: "success",
          title: "Stamped",
          message: "Check your email to confirm your account.",
        });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthPlaqueHeader
        title="Request Access"
        subtitle="Create an account for your archive."
      />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email ? (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          ) : null}
        </div>
        <PasswordField
          id="register-password"
          label="Password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFieldErrors((prev) => ({ ...prev, password: "" }));
          }}
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <PasswordField
          id="register-confirm"
          label="Confirm password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />
        {status ? (
          <AuthStatusNote tone={status.tone} title={status.title} message={status.message} />
        ) : null}
        <div className="space-y-3">
          <motion.div layoutId="auth-primary-action" layout>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              <span>{pending ? "Requesting" : "Create account"}</span>
            </Button>
          </motion.div>
          <AuthFooterLinks mode="register" redirectTo={redirectTo} onSwitch={onSwitchMode} />
        </div>
      </form>
    </div>
  );
}
