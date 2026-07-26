// Elementos gráficos decorativos no fundo das páginas — puramente visual,
// sem interação (pointer-events-none) e ocultos de leitores de tela.

function Estrela({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c.8 4.9 2.3 8.3 4.5 10.2C18.6 12 21.4 12.8 24 13c-2.6.2-5.4 1-7.5 2.8-2.2 1.9-3.7 5.3-4.5 10.2-.8-4.9-2.3-8.3-4.5-10.2C5.4 14 2.6 13.2 0 13c2.6-.2 5.4-1 7.5-2.8C9.7 8.3 11.2 4.9 12 0Z" />
    </svg>
  );
}

function Bolinha({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" />
    </svg>
  );
}

function Rabisco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 8c5-8 10 8 15 0s10-8 15 0 10 8 15 0 10-8 15 0"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Anel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Losango({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" transform="rotate(45 12 12)" />
    </svg>
  );
}

function Coracao({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21s-7.5-4.6-10.3-9C-.4 8.6 1 4.5 5 3.6c2.4-.5 4.6.6 7 3 2.4-2.4 4.6-3.5 7-3 4 .9 5.4 5 3.3 8.4C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

const ITENS: { Icone: typeof Estrela; className: string; flutuar?: boolean }[] = [
  { Icone: Estrela, className: "top-[6%] left-[5%] h-6 w-6 text-coral/70", flutuar: true },
  { Icone: Bolinha, className: "top-[14%] right-[8%] h-3 w-3 text-sky/70" },
  { Icone: Rabisco, className: "top-[22%] left-[3%] h-4 w-16 text-sage/60 hidden sm:block" },
  { Icone: Anel, className: "top-[38%] right-[4%] h-10 w-10 text-mustard/60 hidden sm:block", flutuar: true },
  { Icone: Losango, className: "bottom-[28%] left-[7%] h-5 w-5 text-blush/80 hidden sm:block" },
  { Icone: Estrela, className: "bottom-[18%] right-[10%] h-4 w-4 text-sky/70" },
  { Icone: Coracao, className: "bottom-[10%] left-[12%] h-5 w-5 text-coral/50 hidden sm:block" },
  { Icone: Bolinha, className: "top-[55%] left-[2%] h-2 w-2 text-mustard/80" },
  { Icone: Rabisco, className: "bottom-[6%] right-[6%] h-3 w-14 text-blush/70 hidden sm:block" },
  { Icone: Anel, className: "top-[8%] right-[22%] h-5 w-5 text-sage/70" },
];

export function BackgroundDecor() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {ITENS.map(({ Icone, className, flutuar }, indice) => (
        <Icone
          key={indice}
          className={`absolute ${className} ${flutuar ? "formo-float" : ""}`}
        />
      ))}
    </div>
  );
}
