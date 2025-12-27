import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";

import AppShell from "@/components/shell/AppShell";
import { siteConfig } from "@/lib/seo/site";
import { buildOpenGraph, buildTwitter } from "@/lib/seo/og";
import "katex/dist/katex.min.css";
import "./globals.css";
import "../styles/prose.css";

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
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.defaultDescription,
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: buildOpenGraph({
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    pathname: "/",
    image: siteConfig.defaultOg,
    type: "website",
  }),
  twitter: buildTwitter({
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    image: siteConfig.defaultOg,
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
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
