import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não configurada. Confira o .env.local (veja .env.local.example).`
    );
  }
  return value;
}

export const env = {
  get CLICKUP_API_TOKEN() {
    return required("CLICKUP_API_TOKEN");
  },
  get CLICKUP_LIST_ID() {
    return required("CLICKUP_LIST_ID");
  },
  get CLICKUP_FIELD_TIPO_SOLICITACAO() {
    return required("CLICKUP_FIELD_TIPO_SOLICITACAO");
  },
  get CLICKUP_FIELD_NOME_TURMA() {
    return required("CLICKUP_FIELD_NOME_TURMA");
  },
  get CLICKUP_STATUS_INICIAL() {
    return process.env.CLICKUP_STATUS_INICIAL || "briefings";
  },
  get CLICKUP_STATUS_FINALIZADO() {
    return process.env.CLICKUP_STATUS_FINALIZADO || "finalizado";
  },
  // Segredo do webhook, obtido só depois de registrar o webhook no ClickUp
  // (etapa de deploy). Enquanto não existe, a verificação de assinatura é
  // pulada — não deve ficar assim em produção.
  get CLICKUP_WEBHOOK_SECRET() {
    return process.env.CLICKUP_WEBHOOK_SECRET || "";
  },
  get RESEND_API_KEY() {
    return required("RESEND_API_KEY");
  },
  get RESEND_FROM_EMAIL() {
    return process.env.RESEND_FROM_EMAIL || "Formô Brasil <onboarding@resend.dev>";
  },
  // Segredo usado para assinar (HMAC) o link mágico de login e o cookie de
  // sessão do portal do cliente — não é chave de API de terceiro, só precisa
  // ser uma string longa e aleatória própria deste projeto.
  get AUTH_SECRET() {
    return required("AUTH_SECRET");
  },
  get APP_URL() {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  },
};
