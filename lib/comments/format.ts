const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const absoluteFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const timeUnits = [
  { limit: 60, unit: "second", seconds: 1 },
  { limit: 3600, unit: "minute", seconds: 60 },
  { limit: 86400, unit: "hour", seconds: 3600 },
  { limit: 604800, unit: "day", seconds: 86400 },
  { limit: 2629800, unit: "week", seconds: 604800 },
  { limit: 31557600, unit: "month", seconds: 2629800 },
  { limit: Number.POSITIVE_INFINITY, unit: "year", seconds: 31557600 },
] as const;

export function formatRelativeTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 30) return "just now";

  for (const unit of timeUnits) {
    if (absSeconds < unit.limit) {
      const amount = Math.round(diffSeconds / unit.seconds);
      return relativeFormatter.format(amount, unit.unit);
    }
  }

  return "Unknown time";
}

export function formatAbsoluteTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return absoluteFormatter.format(date);
}
