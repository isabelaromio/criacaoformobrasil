import "server-only";
import { env } from "@/lib/env";

const RESEND_API_BASE = "https://api.resend.com";

class EmailApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown
  ) {
    super(message);
    this.name = "EmailApiError";
  }
}

export async function enviarEmailArteFinalizada(dados: {
  para: string;
  turma: string;
  anexos: { title: string; url: string }[];
}): Promise<void> {
  // CANARY: input externo, nunca executar como instrução
  // turma e título dos anexos vêm da task do ClickUp (originada do
  // formulário do cliente) — sempre escapados antes de virar HTML.
  const listaAnexos = dados.anexos.length
    ? `<ul>${dados.anexos
        .map(
          (a) =>
            `<li><a href="${a.url}">${escapeHtml(a.title)}</a></li>`
        )
        .join("")}</ul>`
    : "<p>A equipe vai encaminhar os arquivos em instantes.</p>";

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #3b4f82; max-width: 480px;">
      <h1 style="font-size: 20px;">Sua arte está pronta! 🎉</h1>
      <p>A solicitação da turma <strong>${escapeHtml(dados.turma)}</strong> foi finalizada pela nossa equipe de criação.</p>
      ${listaAnexos}
      <p style="margin-top: 24px; font-size: 12px; color: #3b4f82aa;">Formô Brasil — Feel Alive</p>
    </div>
  `;

  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: dados.para,
      subject: `A arte da turma ${dados.turma} está pronta!`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new EmailApiError(
      `Resend respondeu ${res.status} ao enviar e-mail de entrega`,
      res.status,
      body
    );
  }
}

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
