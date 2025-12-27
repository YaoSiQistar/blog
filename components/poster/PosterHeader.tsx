import { posterConfig, resolveIssue } from "@/lib/poster/config";
import { cn } from "@/lib/utils";

type PosterHeaderProps = {
  date: string;
  issue?: string;
  series?: string;
  className?: string;
};

export default function PosterHeader({
  date,
  issue,
  series,
  className,
}: PosterHeaderProps) {
  const resolvedIssue = issue || resolveIssue({ issue, date });
  const hasBadge = Boolean(series || resolvedIssue);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
        文章封面
      </div>
      {hasBadge ? (
        <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
          {series ? (
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">
              {posterConfig.issue.seriesLabel} {series}
            </span>
          ) : null}
          {resolvedIssue ? (
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-foreground/80">
              {posterConfig.issue.label} {resolvedIssue}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
