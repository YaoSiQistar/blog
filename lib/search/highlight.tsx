import React from "react";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function highlightText(text: string, query: string) {
  if (!query.trim()) return [text];
  const tokens = Array.from(
    new Set(
      query
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
    )
  );

  if (!tokens.length) return [text];

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  const tokenSet = new Set(tokens.map((token) => token.toLowerCase()));

  return parts.map((part, index) => {
    if (!part) return null;
    const isMatch = tokenSet.has(part.toLowerCase());
    if (!isMatch) return part;
    return (
      <span key={`${part}-${index}`} className="search-highlight">
        {part}
      </span>
    );
  });
}
