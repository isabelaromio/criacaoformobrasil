// Arco-íris decorativo de fundo, no espírito de identidade Formô (mesma
// sequência de cores da faixa do topo) — puramente visual.

const CAMINHO =
  "M 900 10 C 700 90, 760 230, 540 270 C 340 306, 300 400, 120 430 C 40 444, -20 470, -60 500";

const CORES = ["#f06654", "#fbb958", "#86b8a1", "#5fc9ea", "#f8c5c6"];

export function RainbowSwoosh({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      className={className}
      preserveAspectRatio="xMaxYMin slice"
      aria-hidden="true"
    >
      {CORES.map((cor, indice) => (
        <path
          key={cor}
          d={CAMINHO}
          stroke={cor}
          strokeWidth={26}
          strokeLinecap="round"
          transform={`translate(0 ${indice * 30})`}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}
