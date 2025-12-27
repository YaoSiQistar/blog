import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { batchUpdateComments } from "@/lib/admin/comments";
import { isAdminKeyValid, getAdminKeyFromRequest } from "@/lib/admin/gate";
import type { AdminBatchAction } from "@/lib/admin/types";

type BatchPayload = {
  ids?: string[];
  action?: AdminBatchAction;
};

export async function POST(request: NextRequest) {
  const adminKey = getAdminKeyFromRequest(request);
  if (!isAdminKeyValid(adminKey)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let payload: BatchPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const ids = Array.isArray(payload.ids) ? payload.ids.filter(Boolean) : [];
  const action = payload.action;

  if (!ids.length || !action) {
    return NextResponse.json(
      { ok: false, error: "ids and action are required." },
      { status: 400 }
    );
  }

  if (action !== "approve" && action !== "hide" && action !== "spam") {
    return NextResponse.json({ ok: false, error: "Invalid action." }, { status: 400 });
  }

  try {
    const result = await batchUpdateComments(ids, action);
    return NextResponse.json({ ok: true, updated: result.updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to update comments." },
      { status: 500 }
    );
  }
}
