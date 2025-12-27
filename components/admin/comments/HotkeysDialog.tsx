import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

type HotkeysDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HotkeysDialog({ open, onOpenChange }: HotkeysDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          ? 快捷键
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border border-border/70 bg-card/95">
        <DialogHeader>
          <DialogTitle>审核快捷键</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>下一条评论</span>
            <Kbd>J</Kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>上一条评论</span>
            <Kbd>K</Kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>通过</span>
            <Kbd>A</Kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>隐藏</span>
            <Kbd>H</Kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>切换选中</span>
            <Kbd>X</Kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>帮助</span>
            <KbdGroup>
              <Kbd>?</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span>关闭面板 / 清空</span>
            <Kbd>Esc</Kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
