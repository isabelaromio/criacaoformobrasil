import { FormoLogo } from "@/components/FormoLogo";
import { PixelCursor } from "@/components/PixelCursor";
import { SolicitacaoForm } from "@/components/SolicitacaoForm";

export default function Home() {
  return (
    <div className="y2k-backdrop relative flex min-h-full flex-1 flex-col">
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
          <span className="hidden items-center gap-1.5 rounded-full bg-navy/10 px-3 py-1 font-mono text-[11px] text-navy/70 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            REC
          </span>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:px-10">
        <div className="relative">
          <h1 className="y2k-glow font-display text-3xl text-formo-blue sm:text-4xl">
            Solicitar uma arte para a sua turma
          </h1>
          <h1 className="relative font-display text-3xl text-navy sm:text-4xl">
            Solicitar uma arte para a sua turma
          </h1>
        </div>
        <p className="mt-3 max-w-lg text-navy/70">
          Preencha os campos abaixo. Sua solicitação entra direto na fila da
          nossa equipe de criação.
        </p>

        <div className="mt-8">
          <SolicitacaoForm />
        </div>
      </main>

      <footer className="relative flex items-center justify-center gap-2 px-6 py-6 font-mono text-[11px] tracking-wide text-navy/50 sm:px-10">
        <PixelCursor className="h-3.5 w-3.5" />
        FORMÔ BRASIL — FEEL ALIVE
      </footer>
    </div>
  );
}
