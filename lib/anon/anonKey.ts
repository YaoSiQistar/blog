import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "anon_key";
const ONE_YEAR = 60 * 60 * 24 * 365;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ONE_YEAR,
  secure: process.env.NODE_ENV === "production",
};

export async function getAnonKeyFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export function resolveAnonKey(request: NextRequest) {
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing) {
    return { anonKey: existing, isNew: false };
  }
  return { anonKey: crypto.randomUUID(), isNew: true };
}

export function setAnonKeyCookie(response: NextResponse, anonKey: string) {
  response.cookies.set(COOKIE_NAME, anonKey, cookieOptions);
}
