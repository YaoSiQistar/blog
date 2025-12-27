import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import Container from "@/components/shell/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModerationDesk from "@/components/admin/comments/ModerationDesk";
import { ADMIN_COOKIE_NAME, isAdminKeyValid } from "@/lib/admin/gate";
import { getPostsIndexMap } from "@/lib/content/postsIndex";

interface AdminCommentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

const buildRedirect = (params: Record<string, string | string[] | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key === "key") return;
    if (typeof value === "string") query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/admin/comments?${qs}` : "/admin/comments";
};

export default async function AdminCommentsPage({ searchParams }: AdminCommentsPageProps) {
  const resolved = await searchParams;
  const queryKey = getParam(resolved, "key");
  const error = getParam(resolved, "error");
  const cookieStore = await cookies();
  const cookieKey = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (isAdminKeyValid(cookieKey)) {
    const postIndex = await getPostsIndexMap();
    return (
      <main className="py-[var(--section-y)]">
        <Container variant="wide" className="space-y-6">
          <ModerationDesk postIndex={postIndex} />
        </Container>
      </main>
    );
  }

  if (queryKey && isAdminKeyValid(queryKey)) {
    const redirectTo = buildRedirect(resolved);
    redirect(
      `/api/admin/gate?key=${encodeURIComponent(queryKey)}&redirect=${encodeURIComponent(redirectTo)}`
    );
  }

  return (
    <main className="py-[var(--section-y)]">
      <Container variant="wide" className="space-y-6">
        <section className="rounded-[var(--radius)] border border-border/70 bg-card/70 p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground/70">
            管理员入口
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-foreground">
            审稿台访问
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            输入管理员密钥以继续。
          </p>
          <form method="get" className="mt-6 flex flex-wrap gap-3">
            <Input
              name="key"
              placeholder="ADMIN_SECRET"
              className="h-10 w-full max-w-sm"
            />
            <Button type="submit">解锁</Button>
          </form>
          {error === "unauthorized" ? (
            <p className="mt-3 text-sm text-destructive">密钥无效，请重试。</p>
          ) : null}
        </section>
      </Container>
    </main>
  );
}
