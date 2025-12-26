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
      return { ok: false, error: "Too fast. Try again in a moment." };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || "Network error. Please try again.",
      };
    }

    return { ok: true, status: data.status ?? "pending" };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
