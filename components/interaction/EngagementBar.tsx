"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import LikeButton from "./LikeButton";
import FavoriteButton from "./FavoriteButton";
import LoginPromptDialog from "./LoginPromptDialog";

type EngagementBarProps = {
  postSlug: string;
  initialCounts: { likes: number; favorites: number; commentsApproved: number };
  initialViewer: { liked: boolean; favorited: boolean };
  isAuthenticated: boolean;
};

export default function EngagementBar({
  postSlug,
  initialCounts,
  initialViewer,
  isAuthenticated,
}: EngagementBarProps) {
  const [counts, setCounts] = React.useState(initialCounts);
  const [liked, setLiked] = React.useState(initialViewer.liked);
  const [favorited, setFavorited] = React.useState(initialViewer.favorited);
  const [pendingLike, setPendingLike] = React.useState(false);
  const [pendingFavorite, setPendingFavorite] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const pathname = usePathname();

  const handleLike = async () => {
    if (pendingLike) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCounts((prev) => ({
      ...prev,
      likes: Math.max(0, prev.likes + (nextLiked ? 1 : -1)),
    }));
    setPendingLike(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postSlug, action: nextLiked ? "like" : "unlike" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");
      setLiked(data.liked);
      setCounts((prev) => ({ ...prev, likes: data.likeCount }));
    } catch (error) {
      console.error(error);
      setLiked(!nextLiked);
      setCounts((prev) => ({
        ...prev,
        likes: Math.max(0, prev.likes + (nextLiked ? -1 : 1)),
      }));
      toast.error("Unable to update like.");
    } finally {
      setPendingLike(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    if (pendingFavorite) return;
    const nextFavorited = !favorited;
    setFavorited(nextFavorited);
    setCounts((prev) => ({
      ...prev,
      favorites: Math.max(0, prev.favorites + (nextFavorited ? 1 : -1)),
    }));
    setPendingFavorite(true);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postSlug, action: nextFavorited ? "add" : "remove" }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setLoginOpen(true);
          return;
        }
        throw new Error(data.error || "Failed");
      }
      setFavorited(data.favorited);
      setCounts((prev) => ({ ...prev, favorites: data.favoriteCount }));
    } catch (error) {
      console.error(error);
      setFavorited(!nextFavorited);
      setCounts((prev) => ({
        ...prev,
        favorites: Math.max(0, prev.favorites + (nextFavorited ? -1 : 1)),
      }));
      toast.error("Unable to update favorite.");
    } finally {
      setPendingFavorite(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card/70 px-4 py-3">
        <LikeButton liked={liked} count={counts.likes} disabled={pendingLike} onClick={handleLike} />
        <FavoriteButton
          favorited={favorited}
          count={counts.favorites}
          disabled={pendingFavorite}
          onClick={handleFavorite}
        />
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          <MessageSquare className="size-4" />
          {counts.commentsApproved}
        </div>
      </div>

      <LoginPromptDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        redirectTo={pathname}
      />
    </>
  );
}
