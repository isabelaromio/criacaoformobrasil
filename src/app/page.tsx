import { PageShell } from "@/components/PageShell";
import { SolicitacaoForm } from "@/components/SolicitacaoForm";

export default function Home() {
  return (
    <PageShell
      heroRainbow
      headerRight={
        <span className="hidden items-center gap-1.5 rounded-full bg-navy/10 px-3 py-1 font-mono text-[11px] text-navy/70 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          REC
        </span>
      }
    >
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
    </PageShell>
  );
}
