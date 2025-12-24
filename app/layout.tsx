import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";

import AppShell from "@/components/shell/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Editorial Journal",
  description:
    "Warm paper editorial blog built with Next.js, Tailwind, and Supabase engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <body
        className={`${inter.variable} ${serif.variable} ${mono.variable} bg-background text-foreground antialiased`}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
