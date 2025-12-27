import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DeskHeaderProps = {
  pending: number;
  approved: number;
  hidden: number;
  onRefresh: () => void;
  onClearKey: () => void;
  hotkeysSlot?: React.ReactNode;
};

export default function DeskHeader({
  pending,
  approved,
  hidden,
  onRefresh,
  onClearKey,
  hotkeysSlot,
}: DeskHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] border border-border/70 bg-card/70 px-5 py-4 shadow-soft">
      <div className="space-y-1">
        <p className="text-[0.6rem] uppercase tracking-[0.5em] text-muted-foreground/70">
          审稿台
        </p>
        <h1 className="text-2xl font-semibold text-foreground">评论审核</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          <Badge variant="secondary" className="rounded-full border-border-subtle bg-card/80">
            待审 {pending}
          </Badge>
          <Badge variant="secondary" className="rounded-full border-border-subtle bg-card/80">
            已通过 {approved}
          </Badge>
          <Badge variant="secondary" className="rounded-full border-border-subtle bg-card/80">
            已隐藏 {hidden}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRefresh}>
          刷新
        </Button>
        {hotkeysSlot}
        <Button variant="ghost" size="sm" onClick={onClearKey}>
          清除管理员密钥
        </Button>
      </div>
    </header>
  );
}
