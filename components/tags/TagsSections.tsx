import { cn } from "@/lib/utils";
import TagGallery, { TagItem } from "@/components/tags/TagGallery";

export type TagSection = {
  id: string;
  title: string;
  tags: TagItem[];
  meta?: {
    countLabel?: string;
    note?: string;
  };
};

type TagsSectionsProps = {
  sections: TagSection[];
};

export default function TagsSections({ sections }: TagsSectionsProps) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          data-topic-section
          className="scroll-mt-[7rem]"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <h2
                data-topic-title
                className={cn(
                  "topic-section-title text-3xl font-semibold uppercase tracking-[0.35em] text-foreground"
                )}
              >
                {section.title}
              </h2>
            </div>
            {section.meta?.countLabel && (
              <span className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
                {section.meta.countLabel}
              </span>
            )}
          </div>
          {section.tags.length > 0 ? (
            <TagGallery tags={section.tags} />
          ) : section.meta?.note ? (
            <p className="text-sm text-muted-foreground">{section.meta.note}</p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
