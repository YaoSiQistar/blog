import type { ComponentProps, ReactNode } from "react";

import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

const flattenText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (!node || typeof node !== "object") return "";
  const props = (node as { props?: { children?: ReactNode } }).props;
  return props?.children ? flattenText(props.children) : "";
};

export function CodeBlock(props: ComponentProps<"pre"> = {}) {
  const { className, children, ...rest } = props;
  const resolvedClassName = Array.isArray(className) ? className.join(" ") : className;
  const codeText = flattenText(children);
  const dataTitle = (rest as { "data-title"?: unknown })["data-title"];
  const title = typeof dataTitle === "string" ? dataTitle : undefined;

  return (
    <div className="markdown-code-figure">
      {title ? <div className="markdown-code-title">{title}</div> : null}
      {codeText ? (
        <div className="markdown-code-toolbar">
          <CopyButton value={codeText} label="复制" />
        </div>
      ) : null}
      <pre {...rest} className={cn("markdown-pre", resolvedClassName)}>
        {children}
      </pre>
    </div>
  );
}
