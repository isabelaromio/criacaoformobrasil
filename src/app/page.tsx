import { FormoLogo } from "@/components/FormoLogo";
import { SolicitacaoForm } from "@/components/SolicitacaoForm";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <header className="bg-mustard px-6 py-6 sm:px-10">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <FormoLogo variant="blue" height={36} />
          <div className="h-8 w-px bg-navy/20" />
          <span className="text-sm font-medium text-navy/80">
            Portal de Solicitações
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold text-navy sm:text-3xl">
          Solicitar uma arte para a sua turma
        </h1>
        <p className="mt-2 text-navy/70">
          Preencha os campos abaixo. Sua solicitação entra direto na fila da
          nossa equipe de criação.
        </p>

        <div className="mt-8">
          <SolicitacaoForm />
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-navy/50 sm:px-10">
        Formô Brasil — Feel Alive
      </footer>
    </div>
  );
}
