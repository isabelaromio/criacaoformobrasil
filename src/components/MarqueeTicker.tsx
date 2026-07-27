const CORES = ["text-coral", "text-mustard", "text-sage", "text-sky", "text-blush"];

function Conteudo() {
  return (
    <span className="formo-marquee-track py-1.5 font-mono text-[11px] tracking-widest uppercase">
      {Array.from({ length: 2 }).map((_, copia) => (
        <span key={copia} className="flex items-center">
          {Array.from({ length: 8 }).map((_, indice) => (
            <span key={indice} className="flex items-center">
              <span className="mx-4 text-cream">Feel Alive</span>
              <span className={CORES[indice % CORES.length]}>✦</span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function MarqueeTicker() {
  return (
    <div className="formo-marquee">
      <Conteudo />
    </div>
  );
}
