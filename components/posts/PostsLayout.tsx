import type { ReactNode } from "react";

type PostsLayoutProps = {
  left?: ReactNode;
  right?: ReactNode;
  mobileControls?: ReactNode;
  contentId?: string;
  children: ReactNode;
};

export default function PostsLayout({
  left,
  right,
  mobileControls,
  contentId,
  children,
}: PostsLayoutProps) {
  return (
    <div className="space-y-[var(--section-y)] py-[var(--section-y)]">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
        {mobileControls && (
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            {mobileControls}
          </div>
        )}
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{left}</div>
          </aside>
          <div id={contentId} className="min-w-0 space-y-10">
            {children}
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
              {right}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
