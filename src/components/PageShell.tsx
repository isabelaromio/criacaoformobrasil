import type { ReactNode } from "react";
import { FormoLogo } from "@/components/FormoLogo";
import { PixelCursor } from "@/components/PixelCursor";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { RainbowSwoosh } from "@/components/RainbowSwoosh";

export function PageShell({
  headerRight,
  mainWidth = "2xl",
  centerVertically = false,
  heroRainbow = false,
  children,
}: {
  headerRight?: ReactNode;
  mainWidth?: "md" | "2xl";
  centerVertically?: boolean;
  heroRainbow?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="y2k-backdrop relative flex min-h-full flex-1 flex-col">
      <MarqueeTicker />
      <BackgroundDecor />
      <div className="y2k-grain" />

      <header className="relative bg-gradient-to-b from-[#ffc978] to-mustard px-6 py-6 shadow-[0_1px_0_rgba(59,79,130,0.25)] sm:px-10">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FormoLogo variant="blue" height={36} />
            <div className="h-8 w-px bg-navy/20" />
            <span className="font-mono text-xs tracking-widest text-navy/70 uppercase">
              Portal de Solicitações
            </span>
          </div>
          {headerRight}
        </div>
      </header>

      <main
        className={`relative z-10 mx-auto w-full flex-1 px-6 py-12 sm:px-10 ${
          mainWidth === "md" ? "max-w-md" : "max-w-2xl"
        } ${centerVertically ? "flex flex-col justify-center" : ""}`}
      >
        {heroRainbow && (
          <RainbowSwoosh className="pointer-events-none absolute -top-6 right-0 z-0 h-[420px] w-[560px] max-w-none opacity-90 sm:h-[520px] sm:w-[720px]" />
        )}
        <div className="relative z-10">{children}</div>
      </main>

      <footer className="relative z-10 flex items-center justify-center gap-2 px-6 py-6 font-mono text-[11px] tracking-wide text-navy/50 sm:px-10">
        <PixelCursor className="h-3.5 w-3.5" />
        FORMÔ BRASIL — FEEL ALIVE
      </footer>
    </div>
  );
}
