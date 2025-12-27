import CommentsSection from "@/components/interaction/CommentsSection";
import { getApprovedComments } from "@/lib/engagement/queries";
import { getServerUser } from "@/lib/auth/session";

type CommentsStreamProps = {
  postSlug: string;
};

export default async function CommentsStream({ postSlug }: CommentsStreamProps) {
  const [user, comments] = await Promise.all([getServerUser(), getApprovedComments(postSlug)]);

  return (
    <CommentsSection
      postSlug={postSlug}
      initialComments={comments}
      approvedCount={comments.length}
      viewer={user?.id ? { userId: user.id } : undefined}
    />
  );
}
