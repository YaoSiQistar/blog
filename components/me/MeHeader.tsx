"use client";

import * as React from "react";
import { motion } from "motion/react";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { createSupabaseClient } from "@/lib/supabase/client";
import { buildRedirectQuery } from "@/lib/auth/redirect";
import { cn } from "@/lib/utils";

type MeHeaderProps = {
  email?: string | null;
};

export default function MeHeader({ email }: MeHeaderProps) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [expired, setExpired] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!data.user) setExpired(true);
      } catch {
        if (mounted) setExpired(true);
      }
    };
    void checkSession();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (pending) return;
    setPending(true);
    try {
      const supabase = createSupabaseClient();
      await supabase.auth.signOut();
    } finally {
      router.push(`/login${buildRedirectQuery("/me")}`);
      router.refresh();
      setPending(false);
    }
  };

  return (
    <motion.section
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: motionTokens.durations.normal, ease: motionTokens.easing.easeOut }
      }
      className="space-y-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground/70">
            Dossier
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My Dossier
          </h1>
          <p className="text-sm text-muted-foreground">
            Saved works, notes, and activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-xl)] border border-border/70 bg-card/70 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full border border-border/80 bg-background/70">
              <UserRound className="size-3.5" />
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground/70">
              Archivist
            </span>
          </div>
          <span className="text-sm text-foreground">
            {email || "Signed in"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={pending}
            className={cn("text-xs uppercase tracking-[0.3em]", pending && "opacity-60")}
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </div>

      {expired ? (
        <div className="rounded-[var(--radius)] border border-destructive/30 bg-[rgba(226,79,79,0.08)] px-4 py-3 text-sm text-destructive">
          Session expired. Please sign in again.
        </div>
      ) : null}
    </motion.section>
  );
}
