"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import AuthStatusNote from "@/components/auth/AuthStatusNote";
import PasswordField from "@/components/auth/PasswordField";
import AnimatedLink from "@/components/motion/AnimatedLink";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { mapSupabaseError } from "@/lib/auth/errors";
import { resetPasswordSchema } from "@/lib/auth/validators";
import { buildRedirectQuery } from "@/lib/auth/redirect";

type StatusState = {
  tone: "error" | "success";
  title: string;
  message: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirectTo");
  const code = searchParams.get("code");
  const query = buildRedirectQuery(redirectTo);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [pending, setPending] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [status, setStatus] = React.useState<StatusState | null>(null);

  React.useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      const supabase = createSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        if (active) setReady(true);
        return;
      }

      if (!code) {
        if (active) {
          setStatus({
            tone: "error",
            title: "访问已过期",
            message: "恢复链接缺失或已过期，请重新申请。",
          });
        }
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!active) return;
      if (error) {
        setStatus({
          tone: "error",
          title: "访问被拒绝",
          message: mapSupabaseError(error) ?? "无法验证恢复链接。",
        });
        return;
      }
      setReady(true);
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, [code]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});
    setStatus(null);

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
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
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setStatus({
          tone: "error",
          title: "重置失败",
          message: mapSupabaseError(error) ?? "无法更新密码。",
        });
        return;
      }
      await supabase.auth.signOut();
      setStatus({
        tone: "success",
        title: "已完成",
        message: "密码已更新，请重新登录。",
      });
      router.replace(`/login?reset=1${query ? `&${query.slice(1)}` : ""}`);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-4rem)] py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide" className="flex items-center justify-center">
        <section className="w-full max-w-[460px] space-y-6 rounded-[var(--radius-2xl)] border border-border/70 bg-background/60 p-6 backdrop-blur-md">
          <div className="space-y-2">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground/70">
              索引台
            </p>
            <h1 className="text-2xl font-semibold">重置访问</h1>
            <p className="text-sm text-muted-foreground">
              选择新密码以重新开启你的归档。
            </p>
          </div>

          {!ready && !status ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin" />
              正在验证恢复链接...
            </div>
          ) : null}

          {status ? (
            <AuthStatusNote tone={status.tone} title={status.title} message={status.message} />
          ) : null}

          {ready ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <PasswordField
                id="reset-password"
                label="新密码"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
                autoComplete="new-password"
                error={fieldErrors.password}
                autoFocus
              />
              <PasswordField
                id="reset-confirm"
                label="确认密码"
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                autoComplete="new-password"
                error={fieldErrors.confirmPassword}
              />
              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? <Loader2 className="animate-spin" /> : null}
                  <span>{pending ? "更新中" : "更新密码"}</span>
                </Button>
                <AnimatedLink href={`/login${query}`} className="text-xs">
                  返回登录
                </AnimatedLink>
              </div>
            </form>
          ) : null}

          {!ready && status?.tone === "error" ? (
            <div className="text-xs text-muted-foreground">
              <AnimatedLink href={`/forgot-password${query}`} className="text-xs">
                重新申请恢复邮件
              </AnimatedLink>
            </div>
          ) : null}
        </section>
      </Container>
    </main>
  );
}
