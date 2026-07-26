import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { obterEmailSessao } from "@/lib/auth";
import { buscarTaskDetalhada } from "@/lib/clickup";
import { FormoLogo } from "@/components/FormoLogo";
import { PixelCursor } from "@/components/PixelCursor";
import { ChatRevisao } from "@/components/ChatRevisao";

export default async function TaskPortalPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const email = await obterEmailSessao();
  if (!email) {
    redirect("/login");
  }

  const task = await buscarTaskDetalhada(taskId).catch(() => null);
  if (!task || !task.emailContato || task.emailContato.toLowerCase() !== email.toLowerCase()) {
    notFound();
  }

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
          <form action="/api/auth/sair" method="POST">
            <button
              type="submit"
              className="font-mono text-[11px] tracking-wide text-navy/60 underline hover:text-navy"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:px-10">
        <Link href="/portal" className="text-sm font-medium text-formo-blue underline">
          ← Voltar para suas solicitações
        </Link>

        <div className="relative mt-4">
          <h1 className="y2k-glow font-display text-2xl text-formo-blue sm:text-3xl">
            {task.turma}
          </h1>
          <h1 className="relative font-display text-2xl text-navy sm:text-3xl">
            {task.turma}
          </h1>
        </div>

        {task.anexos.length > 0 && (
          <div className="mt-6 rounded-xl border border-sage/40 bg-sage/10 p-5">
            <p className="font-semibold text-navy">Arquivos entregues</p>
            <ul className="mt-2 flex flex-col gap-1">
              {task.anexos.map((anexo) => (
                <li key={anexo.url}>
                  <a
                    href={anexo.url}
                    className="text-formo-blue underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {anexo.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <ChatRevisao taskId={task.id} />
        </div>
      </main>

      <footer className="relative flex items-center justify-center gap-2 px-6 py-6 font-mono text-[11px] tracking-wide text-navy/50 sm:px-10">
        <PixelCursor className="h-3.5 w-3.5" />
        FORMÔ BRASIL — FEEL ALIVE
      </footer>
    </div>
  );
}
