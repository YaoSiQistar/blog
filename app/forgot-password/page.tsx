"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import AuthStatusNote from "@/components/auth/AuthStatusNote";
import AnimatedLink from "@/components/motion/AnimatedLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseClient } from "@/lib/supabase/client";
import { mapSupabaseError } from "@/lib/auth/errors";
import { buildRedirectQuery } from "@/lib/auth/redirect";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const query = buildRedirectQuery(redirectTo);
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [status, setStatus] = React.useState<{
    tone: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setStatus(null);
    try {
      const supabase = createSupabaseClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const emailRedirectTo = origin
        ? `${origin}/reset-password${query}`
        : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: emailRedirectTo,
      });
      if (error) {
        const message = mapSupabaseError(error) ?? "无法发送重置邮件。";
        setStatus({ tone: "error", title: "请求失败", message });
        return;
      }
      setStatus({
        tone: "success",
        title: "已发出",
        message: "请检查邮箱中的重置链接。",
      });
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
            <h1 className="text-2xl font-semibold">找回访问权限</h1>
            <p className="text-sm text-muted-foreground">
              我们会向你的邮箱发送重置链接。
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="reset-email">邮箱</Label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            {status ? (
              <AuthStatusNote tone={status.tone} title={status.title} message={status.message} />
            ) : null}
            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : null}
                <span>{pending ? "发送中" : "发送重置链接"}</span>
              </Button>
              <AnimatedLink href={`/login${query}`} className="text-xs">
                返回登录
              </AnimatedLink>
            </div>
          </form>
        </section>
      </Container>
    </main>
  );
}
