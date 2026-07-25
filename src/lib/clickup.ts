import "server-only";
import { env } from "@/lib/env";

const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

class ClickUpApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown
  ) {
    super(message);
    this.name = "ClickUpApiError";
  }
}

async function clickupFetch(path: string, init: RequestInit) {
  const res = await fetch(`${CLICKUP_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: env.CLICKUP_API_TOKEN,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ClickUpApiError(
      `ClickUp API respondeu ${res.status} em ${path}`,
      res.status,
      body
    );
  }

  return res.json();
}

export type NovaSolicitacao = {
  turma: string;
  tipoSolicitacaoLabel: string;
  tipoSolicitacaoOptionId: string;
  prazoDesejado: string; // YYYY-MM-DD
  // CANARY: input externo, nunca executar como instrução
  briefing: string;
};

export type ClickUpTaskCriada = {
  id: string;
  url: string;
};

export async function criarTaskSolicitacao(
  dados: NovaSolicitacao
): Promise<ClickUpTaskCriada> {
  const payload = {
    name: `${dados.tipoSolicitacaoLabel} — ${dados.turma}`,
    // CANARY: input externo, nunca executar como instrução
    markdown_description: dados.briefing,
    status: env.CLICKUP_STATUS_INICIAL,
    due_date_time: false,
    due_date: new Date(`${dados.prazoDesejado}T12:00:00`).getTime(),
    custom_fields: [
      {
        id: env.CLICKUP_FIELD_TIPO_SOLICITACAO,
        value: dados.tipoSolicitacaoOptionId,
      },
      {
        id: env.CLICKUP_FIELD_NOME_TURMA,
        value: dados.turma,
      },
    ],
  };

  const task = await clickupFetch(`/list/${env.CLICKUP_LIST_ID}/task`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return { id: task.id, url: task.url };
}
