import Container from "@/components/shell/Container";
import PaperAtmosphere from "@/components/atmosphere/PaperAtmosphere";
import PlaqueFlipCard from "@/components/auth/PlaqueFlipCard";
import KintsugiGate from "@/components/auth/KintsugiGate";
import { cn } from "@/lib/utils";

export type AuthMode = "login" | "register";

type AuthFlipPageProps = {
  mode: AuthMode;
  redirectTo?: string | null;
  notice?: string | null;
};

export default function AuthFlipPage({
  mode,
  redirectTo,
  notice,
}: AuthFlipPageProps) {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] py-[var(--section-y)]">
      <PaperAtmosphere />
      <KintsugiGate />
      <Container variant="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex min-h-[520px] items-center justify-center">
            <div className="w-full max-w-[460px] space-y-5">
              <div className="space-y-2">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground/70">
                  索引台
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-[1px] w-7 bg-border/70" />
                  访问
                </div>
              </div>
              <PlaqueFlipCard mode={mode} redirectTo={redirectTo} notice={notice} />
              <p className="text-xs text-muted-foreground">
                归档会保存你的收藏、批注与个人整理记录。
              </p>
            </div>
          </section>
          <aside className="hidden items-center lg:flex">
            <div
              className={cn(
                "w-full rounded-[var(--radius-xl)] border border-border/70 bg-card/60 p-6 text-sm",
                "backdrop-blur-md"
              )}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
                今日导览
              </p>
              <p className="mt-4 text-base font-medium">
                解锁收藏、评论与个人目录轨迹。
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                你的归档保持私密、同步，并可在多设备间携带。
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
