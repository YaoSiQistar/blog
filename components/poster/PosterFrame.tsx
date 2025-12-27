import { posterTokens } from "@/lib/poster/tokens";
import { posterConfig } from "@/lib/poster/config";
import { cn } from "@/lib/utils";

const grainSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

type PosterFrameProps = {
  children: React.ReactNode;
  className?: string;
  withWash?: boolean;
  coverUrl?: string;
};

export default function PosterFrame({
  children,
  className,
  withWash = false,
  coverUrl,
}: PosterFrameProps) {
  const showGrain = posterConfig.enableGrain;

  const backgroundImage = [
    "radial-gradient(circle at 20% 10%, rgba(17,24,39,0.04), transparent 60%)",
    "radial-gradient(circle at 80% 90%, rgba(30,58,138,0.06), transparent 55%)",
    showGrain ? `url('${grainSvg}')` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const washStyle = withWash && coverUrl
    ? {
        backgroundImage: `linear-gradient(rgba(250,250,249,0.82), rgba(250,250,249,0.92)), url('${coverUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "saturate(0.7)",
      }
    : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius)] border border-border bg-[var(--poster-paper)]",
        "shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)]",
        className
      )}
      style={washStyle}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage,
          opacity: posterTokens.grain.maxOpacity,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
