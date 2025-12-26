export const DEFAULT_AUTH_REDIRECT = "/me";

const isSafeRedirect = (value: string) => value.startsWith("/");

const extractValue = (value?: string | string[] | null) => {
  if (!value) return null;
  return Array.isArray(value) ? value[0] : value;
};

export function resolveRedirect(
  value?: string | string[] | null,
  fallback = DEFAULT_AUTH_REDIRECT
) {
  const resolved = extractValue(value);
  if (!resolved) return fallback;
  return isSafeRedirect(resolved) ? resolved : fallback;
}

export function getRedirectTo(searchParams?: Record<string, string | string[] | undefined>) {
  if (!searchParams) return null;
  const redirectTo = extractValue(searchParams.redirectTo);
  const legacyRedirect = extractValue(searchParams.redirect);
  return redirectTo || legacyRedirect;
}

export function buildRedirectQuery(redirectTo?: string | null) {
  if (!redirectTo) return "";
  return `?redirectTo=${encodeURIComponent(redirectTo)}`;
}
