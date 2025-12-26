import type { AnchorHTMLAttributes } from "react";

import AnimatedLink from "@/components/motion/AnimatedLink";
import { HeadingAnchor } from "./HeadingAnchor";
import { cn } from "@/lib/utils";

type MarkdownLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-heading-anchor"?: string;
  "data-paragraph-anchor"?: string;
  "data-citation"?: string;
  "data-cite-id"?: string;
  "data-missing"?: string;
};

export function MarkdownLink(props: MarkdownLinkProps = {}) {
  const { href, children, className, ...rest } = props;
  const resolvedClassName = typeof className === "string" ? className : "";

  if (rest["data-heading-anchor"] === "true") {
    return <HeadingAnchor href={href} variant="heading" className={resolvedClassName} />;
  }

  if (rest["data-paragraph-anchor"] === "true") {
    return <HeadingAnchor href={href} variant="paragraph" className={resolvedClassName} />;
  }

  if (rest["data-citation"] === "true") {
    const citeId = rest["data-cite-id"] ?? children?.toString() ?? "ref";
    return (
      <sup className="markdown-citation">
        <a href={href} className="markdown-citation-link">
          [{citeId}]
        </a>
      </sup>
    );
  }

  const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
  const isAnchor = typeof href === "string" && href.startsWith("#");
  const missing = rest["data-missing"] === "true";

  if (isExternal || isAnchor) {
    return (
      <a
        href={href}
        className={cn("markdown-link", missing && "markdown-link-missing", resolvedClassName)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <AnimatedLink
      href={href ?? "#"}
      className={cn("markdown-link", missing && "markdown-link-missing", resolvedClassName)}
    >
      {children}
    </AnimatedLink>
  );
}
