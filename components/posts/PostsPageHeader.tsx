import type { ReactNode } from "react";

type PostsPageHeaderProps = {
  title: string;
  description: string;
  summary: string;
  resultsCount: number;
  totalPages: number;
  actions?: ReactNode;
};

export default function PostsPageHeader({
  title,
  description,
  summary,
  resultsCount,
  totalPages,
  actions,
}: PostsPageHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
            博客索引
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
        </div>
        {actions}
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground/80">
        <span>{summary}</span>
        <span className="h-3 w-px bg-border" />
        <span>{resultsCount} 篇</span>
        <span className="h-3 w-px bg-border" />
        <span>{totalPages} 页</span>
      </div>
    </header>
  );
}
