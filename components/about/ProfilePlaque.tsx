"use client";

import Image from "next/image";
import { Copy, ExternalLink, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProfilePlaqueProps = {
  name?: string;
  avatar?: string;
  role?: string;
  location?: string;
  now?: string;
  email?: string;
  links?: Array<{ label: string; url: string }>;
};

export default function ProfilePlaque({
  name,
  avatar,
  role,
  location,
  now,
  email,
  links = [],
}: ProfilePlaqueProps) {
  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast.success("邮箱已复制。");
    } catch (error) {
      console.error(error);
      toast.error("无法复制邮箱。");
    }
  };

  return (
    <div
      className={cn(
        "space-y-4 rounded-[var(--radius-2xl)] border border-border/70 bg-background/60 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)]",
        "backdrop-blur-md"
      )}
    >
      <div className="flex items-center gap-4">
        {avatar ? (
          <div className="relative size-16 overflow-hidden rounded-full border border-border/70">
            <Image src={avatar} alt={name ?? "个人头像"} fill className="object-cover" />
          </div>
        ) : null}
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
            档案
          </p>
          <div className="text-lg font-semibold text-foreground">{name ?? "编辑"}</div>
          <div className="text-sm text-muted-foreground">{role ?? "作者 / 构建者"}</div>
        </div>
      </div>

      <div className="grid gap-2 text-sm text-muted-foreground">
        {location ? <div>所在地：{location}</div> : null}
        {now ? (
          <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-foreground/80">
            现在：{now}
          </div>
        ) : null}
        {email ? (
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
            <Mail className="size-3.5" />
            {email}
          </div>
        ) : null}
      </div>

      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={`${link.label}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
              <ExternalLink className="size-3" />
            </a>
          ))}
        </div>
      ) : null}

      {email ? (
        <Button type="button" variant="ghost" size="sm" onClick={handleCopyEmail}>
          <Copy className="size-3.5" />
          复制邮箱
        </Button>
      ) : null}
    </div>
  );
}
