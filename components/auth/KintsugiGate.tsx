import { cn } from "@/lib/utils";

type KintsugiGateProps = {
  className?: string;
};

export default function KintsugiGate({ className }: KintsugiGateProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(14,12,10,0.08)]" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[rgba(198,165,104,0.28)] to-transparent opacity-70" />
      <div className="absolute left-[48%] top-0 h-full w-[1.5px] -skew-x-6 bg-gradient-to-b from-transparent via-[rgba(236,214,155,0.2)] to-transparent opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(9,7,6,0.08),transparent_55%)]" />
    </div>
  );
}
