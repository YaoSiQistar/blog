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
import { loginSchema } from "@/lib/auth/validators";
import { resolveRedirect } from "@/lib/auth/redirect";
import type { AuthMode } from "@/components/auth/AuthFlipPage";

type LoginPaneProps = {
  redirectTo?: string | null;
  onSwitchMode: (mode: AuthMode) => void;
  notice?: string | null;
};

export default function LoginPane({
  redirectTo,
  onSwitchMode,
  notice,
}: LoginPaneProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [pending, setPending] = React.useState(false);
  const [status, setStatus] = React.useState<{
    tone: "error" | "success";
    title: string;
    message: string;
  } | null>(
    notice
      ? {
          tone: "success",
          title: "已确认",
          message: notice,
        }
      : null
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});
    setStatus(null);

    const parsed = loginSchema.safeParse({ email, password });
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const message = mapSupabaseError(error) ?? "无法登录。";
        setStatus({ tone: "error", title: "登录被拒绝", message });
        return;
      }
      const destination = resolveRedirect(redirectTo);
      router.push(destination);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthPlaqueHeader
        title="访问归档"
        subtitle="登录以保存与标注。"
      />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="login-email">邮箱</Label>
          <Input
            id="login-email"
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
          id="login-password"
          label="密码"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFieldErrors((prev) => ({ ...prev, password: "" }));
          }}
          autoComplete="current-password"
          error={fieldErrors.password}
        />
        {status ? (
          <AuthStatusNote tone={status.tone} title={status.title} message={status.message} />
        ) : null}
        <div className="space-y-3">
          <motion.div layoutId="auth-primary-action" layout>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              <span className="motion-reduce:transition-none" data-slot="label">
                {pending ? "登录中" : "登录"}
              </span>
            </Button>
          </motion.div>
          <AuthFooterLinks mode="login" redirectTo={redirectTo} onSwitch={onSwitchMode} />
        </div>
      </form>
    </div>
  );
}
