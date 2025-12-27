import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME, isAdminKeyValid } from "@/lib/admin/gate";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const key = searchParams.get("key");
  const clear = searchParams.get("clear") === "1";
  const redirectTo = searchParams.get("redirect") ?? "/admin/comments";
  const destination = new URL(redirectTo, request.url);

  if (clear) {
    const response = NextResponse.redirect(destination);
    response.cookies.set(ADMIN_COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
    return response;
  }

  if (!isAdminKeyValid(key)) {
    const fail = new URL("/admin/comments?error=unauthorized", request.url);
    return NextResponse.redirect(fail);
  }

  const response = NextResponse.redirect(destination);
  response.cookies.set(ADMIN_COOKIE_NAME, key ?? "", cookieOptions);
  return response;
}
