type FilterSummaryProps = {
  summary: string;
  page: number;
  totalPages: number;
};

export default function FilterSummary({ summary, page, totalPages }: FilterSummaryProps) {
  return (
    <div className="space-y-2 text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
      <p className="text-[0.6rem] tracking-[0.4em]">{summary}</p>
      <p className="text-[0.55rem] text-muted-foreground/70">
        Page {page} / {totalPages}
      </p>
    </div>
  );
}
