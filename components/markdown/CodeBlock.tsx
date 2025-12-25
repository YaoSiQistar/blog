import { ReactNode } from "react";

import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  inline?: boolean;
  className?: string;
  children: ReactNode;
};

const flattenText = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (!node || typeof node !== "object") return "";
  const props = (node as { props?: { children?: ReactNode } }).props;
  return props?.children ? flattenText(props.children) : "";
};

export function CodeBlock({ inline, className, children }: CodeBlockProps) {
  if (inline) {
    return (
      <code className="rounded-[0.4rem] bg-muted p-1 font-mono text-[0.85rem]">
        {children}
      </code>
    );
  }

  const codeText = flattenText(children);
  const language = className?.replace("language-", "") ?? "text";

  return (
    <div className="relative rounded-2xl border border-border bg-card shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className="absolute right-4 top-4 z-10">
        <CopyButton value={codeText} />
      </div>
      <pre
        className={`overflow-auto rounded-2xl border border-border/40 bg-code py-4 px-6 text-sm leading-relaxed ${className ?? ""}`}
        data-language={language}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}
