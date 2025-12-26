"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useRouter } from "next/navigation";

import type { AuthMode } from "@/components/auth/AuthFlipPage";
import LoginPane from "@/components/auth/LoginPane";
import RegisterPane from "@/components/auth/RegisterPane";
import { motionTokens } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/reduced";
import { buildRedirectQuery } from "@/lib/auth/redirect";
import { cn } from "@/lib/utils";

type PlaqueFlipCardProps = {
  mode: AuthMode;
  redirectTo?: string | null;
  notice?: string | null;
};

export default function PlaqueFlipCard({
  mode: initialMode,
  redirectTo,
  notice,
}: PlaqueFlipCardProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [, startTransition] = React.useTransition();

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    const query = buildRedirectQuery(redirectTo || undefined);
    const nextPath = nextMode === "login" ? "/login" : "/register";
    startTransition(() => {
      router.replace(`${nextPath}${query}`);
    });
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: motionTokens.limits.enterY - 2,
      clipPath: "inset(0 0 100% 0)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 0 0)",
      transition: {
        duration: reduced ? 0 : motionTokens.durations.normal,
        ease: motionTokens.easing.easeOut,
      },
    },
    exit: {
      opacity: 0,
      y: 8,
      transition: {
        duration: reduced ? 0 : motionTokens.durations.fast,
        ease: motionTokens.easing.easeOut,
      },
    },
  };

  return (
    <LayoutGroup>
      <motion.section
        layoutId="auth-plaque"
        layout
        className={cn(
          "rounded-[var(--radius-2xl)] border border-border/70 bg-background/60 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]",
          "backdrop-blur-md"
        )}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: motionTokens.durations.normal,
                ease: motionTokens.easing.easeOut,
              }
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {mode === "login" ? (
              <LoginPane
                redirectTo={redirectTo}
                onSwitchMode={switchMode}
                notice={notice}
              />
            ) : (
              <RegisterPane redirectTo={redirectTo} onSwitchMode={switchMode} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </LayoutGroup>
  );
}
