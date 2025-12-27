import path from "path";
import { promises as fs } from "fs";

import { CONTENT_ROOT } from "@/lib/content/fs";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const parts = resolvedParams.path ?? [];
  if (parts.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const decoded = decodeURIComponent(parts.join("/"));
  const resolved = path.resolve(CONTENT_ROOT, decoded);

  if (!resolved.startsWith(CONTENT_ROOT)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext];
    if (!contentType) {
      return new Response("Not found", { status: 404 });
    }

    const data = await fs.readFile(resolved);

    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
