const tokenize = (query: string) =>
  query
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

export function buildSnippet(text: string, query: string, radius = 80): string {
  if (!query.trim()) return text.slice(0, radius * 2).trim();

  const tokens = tokenize(query.toLowerCase());
  const lower = text.toLowerCase();
  let hitIndex = -1;
  let hitLength = 0;

  tokens.forEach((token) => {
    const index = lower.indexOf(token);
    if (index !== -1 && (hitIndex === -1 || index < hitIndex)) {
      hitIndex = index;
      hitLength = token.length;
    }
  });

  if (hitIndex === -1) {
    const fallback = text.slice(0, radius * 2).trim();
    return fallback.length < text.length ? `${fallback}...` : fallback;
  }

  const start = Math.max(hitIndex - radius, 0);
  const end = Math.min(hitIndex + hitLength + radius, text.length);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";
  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}
