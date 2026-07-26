import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { obterEmailSessao } from "@/lib/auth";
import { buscarTaskDetalhada } from "@/lib/clickup";
import { PageShell } from "@/components/PageShell";
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
    <PageShell
      headerRight={
        <form action="/api/auth/sair" method="POST">
          <button
            type="submit"
            className="font-mono text-[11px] tracking-wide text-navy/60 underline hover:text-navy"
          >
            Sair
          </button>
        </form>
      }
    >
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
    </PageShell>
  );
}
