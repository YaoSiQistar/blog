"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AboutFAQProps = {
  items: Array<{ q: string; a: string }>;
};

export default function AboutFAQ({ items }: AboutFAQProps) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
        Questions
      </p>
      <div className="rounded-[var(--radius)] border border-border bg-card/70 px-4">
        <Accordion type="multiple">
          {items.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
