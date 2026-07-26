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

async function enviarEmail(dados: { para: string; assunto: string; html: string }): Promise<void> {
  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: dados.para,
      subject: dados.assunto,
      html: dados.html,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new EmailApiError(
      `Resend respondeu ${res.status} ao enviar e-mail para ${dados.para}`,
      res.status,
      body
    );
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

  await enviarEmail({
    para: dados.para,
    assunto: `A arte da turma ${dados.turma} está pronta!`,
    html,
  });
}

export async function enviarEmailLinkAcesso(dados: {
  para: string;
  link: string;
}): Promise<void> {
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #3b4f82; max-width: 480px;">
      <h1 style="font-size: 20px;">Acessar o portal Formô</h1>
      <p>Clique no botão abaixo para entrar no portal e acompanhar suas solicitações.</p>
      <p style="margin: 24px 0;">
        <a href="${dados.link}" style="background: #f06654; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Entrar no portal</a>
      </p>
      <p style="font-size: 12px; color: #3b4f82aa;">Este link expira em 15 minutos e só pode ser usado uma vez. Se você não pediu o acesso, pode ignorar este e-mail.</p>
      <p style="margin-top: 24px; font-size: 12px; color: #3b4f82aa;">Formô Brasil — Feel Alive</p>
    </div>
  `;

  await enviarEmail({
    para: dados.para,
    assunto: "Seu link de acesso ao portal Formô",
    html,
  });
}

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
