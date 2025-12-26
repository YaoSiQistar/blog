import { redirect } from "next/navigation";

import AuthFlipPage from "@/components/auth/AuthFlipPage";
import { getServerUser } from "@/lib/auth/session";
import { getRedirectTo, resolveRedirect } from "@/lib/auth/redirect";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const user = await getServerUser();
  const redirectTo = getRedirectTo(resolvedSearchParams);

  if (user) {
    redirect(resolveRedirect(redirectTo));
  }

  const verified = resolvedSearchParams?.verified;
  const reset = resolvedSearchParams?.reset;
  const notice =
    typeof reset === "string" && reset === "1"
      ? "Password updated. Sign in again."
      : typeof verified === "string" && verified === "1"
        ? "Email verified. Sign in to continue."
        : null;

  return <AuthFlipPage mode="login" redirectTo={redirectTo} notice={notice} />;
}
