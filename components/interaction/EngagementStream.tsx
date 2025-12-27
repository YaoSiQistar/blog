import EngagementBar from "@/components/interaction/EngagementBar";
import { getCounts, getViewerState } from "@/lib/engagement/queries";
import { getAnonKeyFromCookies } from "@/lib/anon/anonKey";
import { getServerUser } from "@/lib/auth/session";

type EngagementStreamProps = {
  postSlug: string;
};

export default async function EngagementStream({ postSlug }: EngagementStreamProps) {
  const [user, anonKey] = await Promise.all([getServerUser(), getAnonKeyFromCookies()]);
  const [counts, viewer] = await Promise.all([
    getCounts(postSlug),
    getViewerState(postSlug, { userId: user?.id, anonKey }),
  ]);

  return (
    <EngagementBar
      postSlug={postSlug}
      initialCounts={counts}
      initialViewer={viewer}
      isAuthenticated={Boolean(user?.id)}
    />
  );
}
