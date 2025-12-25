"use client";

import { highlightText } from "@/lib/search/highlight";

type MatchSnippetProps = {
  snippet: string;
  query: string;
};

export default function MatchSnippet({ snippet, query }: MatchSnippetProps) {
  if (!snippet) return null;
  return (
    <div className="rounded-[var(--radius)] border border-border/60 bg-card/60 px-3 py-2 text-xs text-muted-foreground">
      <span className="mr-2 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
        Match
      </span>
      <span className="leading-relaxed">{highlightText(snippet, query)}</span>
    </div>
  );
}
