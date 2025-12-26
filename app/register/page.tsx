import { redirect } from "next/navigation";

import AuthFlipPage from "@/components/auth/AuthFlipPage";
import { getServerUser } from "@/lib/auth/session";
import { getRedirectTo, resolveRedirect } from "@/lib/auth/redirect";

type RegisterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const user = await getServerUser();
  const redirectTo = getRedirectTo(resolvedSearchParams);

  if (user) {
    redirect(resolveRedirect(redirectTo));
  }

  return <AuthFlipPage mode="register" redirectTo={redirectTo} />;
}
