// Elementos gráficos decorativos no fundo das páginas — puramente visual,
// sem interação (pointer-events-none) e ocultos de leitores de tela.
// Personagens (NuvemFeliz, EstrelaFeliz) são ilustrações originais, só
// inspiradas no espírito alegre/colorido pedido, sem copiar nenhuma marca.

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

// Personagem original: nuvem sorridente
function NuvemFeliz({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 34a14 14 0 0 1-1-27.9A16 16 0 0 1 46 8a12 12 0 0 1 2 23.9V32H16Z"
      />
      <circle cx="24" cy="24" r="2" fill="#3b4f82" />
      <circle cx="36" cy="24" r="2" fill="#3b4f82" />
      <path
        d="M23 29c2.5 2.5 7.5 2.5 10 0"
        stroke="#3b4f82"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Personagem original: estrela sorridente
function EstrelaFeliz({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 0c1.3 8.1 3.8 13.9 7.5 17C31.1 20 35.5 21.4 40 21.7c-4.5.3-8.9 1.7-12.5 4.7-3.7 3.1-6.2 8.9-7.5 17-1.3-8.1-3.8-13.9-7.5-17C8.9 23.4 4.5 22 0 21.7c4.5-.3 8.9-1.7 12.5-4.7C16.2 13.9 18.7 8.1 20 0Z"
      />
      <circle cx="17" cy="19" r="1.6" fill="#3b4f82" />
      <circle cx="24" cy="19" r="1.6" fill="#3b4f82" />
      <path
        d="M17 23c1.7 1.7 5.3 1.7 7 0"
        stroke="#3b4f82"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const ITENS: { Icone: typeof Estrela; className: string; flutuar?: boolean }[] = [
  { Icone: Estrela, className: "top-[6%] left-[5%] h-7 w-7 text-coral/80", flutuar: true },
  { Icone: Bolinha, className: "top-[14%] right-[8%] h-3 w-3 text-sky/70" },
  { Icone: Rabisco, className: "top-[22%] left-[3%] h-4 w-16 text-sage/70 hidden sm:block" },
  { Icone: Anel, className: "top-[38%] right-[4%] h-11 w-11 text-mustard/70 hidden sm:block", flutuar: true },
  { Icone: Losango, className: "bottom-[28%] left-[7%] h-6 w-6 text-blush/90 hidden sm:block" },
  { Icone: Estrela, className: "bottom-[18%] right-[10%] h-5 w-5 text-sky/80" },
  { Icone: Coracao, className: "bottom-[10%] left-[12%] h-6 w-6 text-coral/60 hidden sm:block" },
  { Icone: Bolinha, className: "top-[55%] left-[2%] h-2.5 w-2.5 text-mustard/90" },
  { Icone: Rabisco, className: "bottom-[6%] right-[6%] h-3 w-14 text-blush/80 hidden sm:block" },
  { Icone: Anel, className: "top-[8%] right-[22%] h-6 w-6 text-sage/80" },
  { Icone: Estrela, className: "top-[45%] right-[14%] h-3 w-3 text-mustard/80 hidden sm:block" },
  { Icone: Bolinha, className: "bottom-[42%] right-[3%] h-2 w-2 text-coral/80 hidden sm:block" },
  { Icone: EstrelaFeliz, className: "top-[28%] right-[6%] h-10 w-10 text-mustard/85 hidden md:block", flutuar: true },
  { Icone: NuvemFeliz, className: "bottom-[16%] left-[4%] h-12 w-16 text-sky/70 hidden md:block" },
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
