import AnimatedLink from "@/components/motion/AnimatedLink";
import { cn } from "@/lib/utils";

type EmbedCardProps = {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
};

export function EmbedCard(props: EmbedCardProps = {}) {
  const { url, title, description, className } = props;
  if (!url) return null;
  let hostname = "";
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    hostname = url;
  }

  return (
    <div className={cn("markdown-embed", className)}>
      <AnimatedLink
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex w-full flex-col gap-2 rounded-(--radius) border border-border/70 bg-card/70 p-4"
      >
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {hostname}
        </div>
        <div className="text-lg font-semibold text-foreground">
          {title ?? "Embedded link"}
        </div>
        {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
      </AnimatedLink>
    </div>
  );
}
