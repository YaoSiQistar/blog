import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { listAdminComments } from "@/lib/admin/comments";
import { isAdminKeyValid, getAdminKeyFromRequest } from "@/lib/admin/gate";
import type { AdminCommentsResponse } from "@/lib/admin/types";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export async function GET(request: NextRequest) {
  const adminKey = getAdminKeyFromRequest(request);
  if (!isAdminKeyValid(adminKey)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = (searchParams.get("status") ?? "pending") as
    | "pending"
    | "approved"
    | "hidden"
    | "spam"
    | "all";
  const q = searchParams.get("q") ?? undefined;
  const page = parseNumber(searchParams.get("page"), 1);
  const pageSize = parseNumber(searchParams.get("pageSize"), 20);
  const sort = (searchParams.get("sort") ?? "newest") as "newest" | "oldest";

  try {
    const result = await listAdminComments({ status, q, page, pageSize, sort });
    const response: AdminCommentsResponse = {
      ok: true,
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      items: result.items,
      stats: result.stats,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Unable to load comments." },
      { status: 500 }
    );
  }
}
