"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/shell/Header";
import TransitionProvider from "@/components/transition/TransitionProvider";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Header variant={isHome ? "hero" : "default"} />
      <main className="relative min-h-[100vh] pt-[5.5rem]">
        <TransitionProvider>{children}</TransitionProvider>
      </main>
    </>
  );
}
