"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { MarkdownFeatures } from "@/lib/markdown/features";
import type { ReferenceEntry } from "@/lib/markdown/types";
import type { PostIndexItem } from "@/lib/content/types";

type MarkdownContextValue = {
  features: MarkdownFeatures;
  references: ReferenceEntry[];
  postIndex: PostIndexItem[];
};

const MarkdownContext = createContext<MarkdownContextValue | null>(null);

export function MarkdownProvider({
  value,
  children,
}: {
  value: MarkdownContextValue;
  children: ReactNode;
}) {
  return <MarkdownContext.Provider value={value}>{children}</MarkdownContext.Provider>;
}

export function useMarkdownContext() {
  return useContext(MarkdownContext);
}
