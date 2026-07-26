import Link from "next/link";
import { redirect } from "next/navigation";
import { obterEmailSessao } from "@/lib/auth";
import { buscarTasksPorEmail } from "@/lib/clickup";
import { PageShell } from "@/components/PageShell";
import { env } from "@/lib/env";

function formatarData(dataCriacao: string): string {
  const timestamp = Number(dataCriacao);
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

export default async function PortalPage() {
  const email = await obterEmailSessao();

  if (!email) {
    redirect("/login");
  }

  const tasks = await buscarTasksPorEmail(email);
  const finalizadas = tasks.filter(
    (t) => t.status.toLowerCase() === env.CLICKUP_STATUS_FINALIZADO.toLowerCase()
  );
  const emAndamento = tasks.filter(
    (t) => t.status.toLowerCase() !== env.CLICKUP_STATUS_FINALIZADO.toLowerCase()
  );

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
      <div className="relative">
        <h1 className="y2k-glow font-display text-3xl text-formo-blue sm:text-4xl">
          Suas solicitações
        </h1>
        <h1 className="relative font-display text-3xl text-navy sm:text-4xl">
          Suas solicitações
        </h1>
      </div>
      <p className="mt-3 max-w-lg text-navy/70">
        Logado como <strong>{email}</strong>
      </p>

      {tasks.length === 0 && (
        <p className="mt-8 text-navy/70">
          Ainda não encontramos solicitações com esse e-mail.
        </p>
      )}

      {finalizadas.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl text-navy">Arte pronta</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {finalizadas.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-sage/40 bg-sage/10 p-5"
              >
                <p className="font-semibold text-navy">{task.name}</p>
                <p className="mt-1 text-xs text-navy/60">{formatarData(task.dataCriacao)}</p>
                {task.anexos.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-1">
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
                ) : (
                  <p className="mt-3 text-sm text-navy/60">
                    A equipe vai anexar os arquivos em instantes.
                  </p>
                )}
                <Link
                  href={`/portal/${task.id}`}
                  className="mt-3 inline-block text-sm font-medium text-formo-blue underline"
                >
                  Ver detalhes e conversar →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {emAndamento.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl text-navy">Em produção</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {emAndamento.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-navy/15 bg-white/60 p-4"
              >
                <p className="font-semibold text-navy">{task.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-navy/60">
                  {task.status}
                </p>
                <Link
                  href={`/portal/${task.id}`}
                  className="mt-2 inline-block text-sm font-medium text-formo-blue underline"
                >
                  Ver detalhes e conversar →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
