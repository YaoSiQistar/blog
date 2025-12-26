import type { ReferenceEntry } from "@/lib/markdown/types";
import { cn } from "@/lib/utils";

const formatReference = (entry: ReferenceEntry) => {
  const parts: string[] = [];
  if (entry.author) {
    parts.push(entry.author);
  }
  if (entry.year) {
    parts.push(`(${entry.year})`);
  }
  if (entry.title) {
    parts.push(entry.title);
  }
  if (entry.source) {
    parts.push(entry.source);
  }
  if (entry.publisher) {
    parts.push(entry.publisher);
  }
  return parts.filter(Boolean).join(". ");
};

type ReferencesProps = {
  references: ReferenceEntry[];
  className?: string;
};

export function References(props?: ReferencesProps | null) {
  const safeProps = props ?? { references: [] };
  const { references = [], className } = safeProps;
  if (!references.length) return null;

  return (
    <section className={cn("markdown-references", className)}>
      <h2 className="markdown-references-title">References</h2>
      <ol className="markdown-references-list">
        {references.map((entry) => (
          <li key={entry.id} id={`ref-${entry.id}`} className="markdown-reference-item">
            <span>{formatReference(entry)}</span>
            {entry.url ? (
              <a href={entry.url} target="_blank" rel="noreferrer" className="markdown-reference-link">
                {entry.url}
              </a>
            ) : null}
            {entry.note ? <div className="markdown-reference-note">{entry.note}</div> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
