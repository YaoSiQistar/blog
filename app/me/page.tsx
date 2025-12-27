import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import KintsugiGate from "@/components/auth/KintsugiGate";
import MeHeader from "@/components/me/MeHeader";
import DossierTabs from "@/components/me/DossierTabs";
import DossierTools from "@/components/me/DossierTools";
import FavoritesList from "@/components/me/FavoritesList";
import EmptyDossierState from "@/components/me/EmptyDossierState";
import ActivityList, { type ActivityItem } from "@/components/me/ActivityList";
import { getServerUser } from "@/lib/auth/session";
import { buildRedirectQuery } from "@/lib/auth/redirect";
import { parseDossierParams, buildDossierHref } from "@/lib/me/query";
import { getFavoritesForUser } from "@/lib/me/favorites";
import { getLikesForUser } from "@/lib/me/likes";
import { getCommentsForUser } from "@/lib/me/comments";

type MePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "我的档案",
  robots: { index: false, follow: false },
};

export default async function MePage({ searchParams }: MePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const state = parseDossierParams(resolvedSearchParams ?? {});
  const user = await getServerUser();

  if (!user) {
    const redirectTo = buildDossierHref(state);
    redirect(`/login${buildRedirectQuery(redirectTo)}`);
  }

  const favorites =
    state.tab === "favorites"
      ? await getFavoritesForUser(user.id, { q: state.q, sort: state.sort })
      : [];

  const likes: ActivityItem[] =
    state.tab === "likes" ? await getLikesForUser(user.id, { q: state.q }) : [];
  const comments: ActivityItem[] =
    state.tab === "comments"
      ? await getCommentsForUser(user.id, { q: state.q })
      : [];

  return (
    <main className="relative py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide" className="space-y-8">
        <MeHeader email={user.email} />
        <div className="h-px w-full bg-border/70" />

        <DossierTabs />
        <DossierTools />

        {state.tab === "favorites" ? (
          favorites.length > 0 ? (
            <FavoritesList items={favorites} view={state.view} />
          ) : (
            <EmptyDossierState tab="favorites" />
          )
        ) : null}

        {state.tab === "likes" ? (
          likes.length > 0 ? (
            <ActivityList items={likes} emptyLabel="暂无点赞。" />
          ) : (
            <EmptyDossierState tab="likes" />
          )
        ) : null}

        {state.tab === "comments" ? (
          comments.length > 0 ? (
            <ActivityList items={comments} emptyLabel="暂无评论。" />
          ) : (
            <EmptyDossierState tab="comments" />
          )
        ) : null}

        <p className="text-xs text-muted-foreground">此档案仅本人可见。</p>
      </Container>
    </main>
  );
}
