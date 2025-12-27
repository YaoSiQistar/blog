"use client";

import AnimatedLink from "@/components/motion/AnimatedLink";
import { buildRedirectQuery } from "@/lib/auth/redirect";
import type { AuthMode } from "@/components/auth/AuthFlipPage";

type AuthFooterLinksProps = {
  mode: AuthMode;
  redirectTo?: string | null;
  onSwitch: (mode: AuthMode) => void;
};

export default function AuthFooterLinks({
  mode,
  redirectTo,
  onSwitch,
}: AuthFooterLinksProps) {
  const query = buildRedirectQuery(redirectTo || undefined);

  if (mode === "login") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => onSwitch("register")}
          className="text-foreground transition hover:text-primary"
        >
          创建账号
        </button>
        <AnimatedLink href={`/forgot-password${query}`} className="text-xs">
          忘记密码
        </AnimatedLink>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
      <button
        type="button"
        onClick={() => onSwitch("login")}
        className="text-foreground transition hover:text-primary"
      >
        已有账号
      </button>
      <AnimatedLink href="/about" className="text-xs text-muted-foreground">
        条款与归档使用说明
      </AnimatedLink>
    </div>
  );
}
