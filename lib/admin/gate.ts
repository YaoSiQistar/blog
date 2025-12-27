import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_key";

export function isAdminKeyValid(key?: string | null) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !key) return false;
  return key === secret;
}

export async function getAdminCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value ?? null;
}

export async function isAdminSession(): Promise<boolean> {
  const key = await getAdminCookie();
  return isAdminKeyValid(key);
}

export function getAdminKeyFromRequest(request: NextRequest): string | null {
  return request.cookies.get(ADMIN_COOKIE_NAME)?.value ?? null;
}
