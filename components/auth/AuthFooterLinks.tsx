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
          Create account
        </button>
        <AnimatedLink href={`/forgot-password${query}`} className="text-xs">
          Forgot password
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
        Already have an account
      </button>
      <AnimatedLink href="/about" className="text-xs text-muted-foreground">
        Terms &amp; archive use
      </AnimatedLink>
    </div>
  );
}
