import { cn } from "@/lib/utils";

type AboutLeadProps = {
  lead: string[];
  highlights?: string[];
};

export default function AboutLead({ lead, highlights = [] }: AboutLeadProps) {
  const trimmedLead = lead.filter(Boolean).slice(0, 4);
  const leadHighlights = highlights.slice(0, 3);

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]">
      <div className="space-y-4 text-base text-muted-foreground">
        {trimmedLead.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      {leadHighlights.length > 0 ? (
        <div
          className={cn(
            "rounded-[var(--radius-xl)] border border-border/70 bg-card/70 p-5 text-sm",
            "backdrop-blur-md"
          )}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
            亮点
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {leadHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 rounded-full bg-foreground/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
