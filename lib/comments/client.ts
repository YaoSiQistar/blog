type SubmitPayload = {
  content: string;
  nickname?: string;
};

type SubmitResult =
  | { ok: true; status: "pending" }
  | { ok: false; error: string };

export async function submitComment(
  postSlug: string,
  payload: SubmitPayload
): Promise<SubmitResult> {
  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postSlug,
        content: payload.content,
        nickname: payload.nickname,
      }),
    });

    if (response.status === 429) {
      return { ok: false, error: "操作过快，请稍后再试。" };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || "网络错误，请稍后再试。",
      };
    }

    return { ok: true, status: data.status ?? "pending" };
  } catch {
    return { ok: false, error: "网络错误，请稍后再试。" };
  }
}
