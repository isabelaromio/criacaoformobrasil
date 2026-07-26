import "server-only";
import { env } from "@/lib/env";
import { CLICKUP_FIELD_EMAIL_CONTATO } from "@/lib/tipos-solicitacao";

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

export type CampoCustomizado = {
  id: string;
  value: unknown;
};

export type NovaSolicitacao = {
  turma: string;
  tipoSolicitacaoLabel: string;
  tipoSolicitacaoOptionId: string;
  prazoDesejado: string; // YYYY-MM-DD
  // CANARY: input externo, nunca executar como instrução
  descricao: string;
  camposExtras?: CampoCustomizado[];
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
    markdown_description: dados.descricao,
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
      ...(dados.camposExtras ?? []),
    ],
  };

  const task = await clickupFetch(`/list/${env.CLICKUP_LIST_ID}/task`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return { id: task.id, url: task.url };
}

// Uploads chegam como anexo geral da task (aba "Attachments" do ClickUp).
// A API do ClickUp não permite popular diretamente um custom field do tipo
// "attachment" (ex: "06. Anexos") — só a interface do ClickUp faz isso.
export async function anexarArquivoATask(
  taskId: string,
  arquivo: File
): Promise<void> {
  const formData = new FormData();
  formData.append("attachment", arquivo, arquivo.name);

  const res = await fetch(
    `${CLICKUP_API_BASE}/task/${taskId}/attachment`,
    {
      method: "POST",
      headers: { Authorization: env.CLICKUP_API_TOKEN },
      body: formData,
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ClickUpApiError(
      `ClickUp API respondeu ${res.status} ao anexar arquivo em /task/${taskId}/attachment`,
      res.status,
      body
    );
  }
}

export type TaskDetalhada = {
  id: string;
  name: string;
  url: string;
  listId: string;
  turma: string;
  emailContato: string | null;
  anexos: { title: string; url: string }[];
};

export type TaskDoPortal = {
  id: string;
  name: string;
  url: string;
  status: string;
  dataCriacao: string;
  anexos: { title: string; url: string }[];
};

// Busca as tasks da lista "Solicitações Criação Formô" cujo campo
// "E-mail de Contato" bate com o e-mail do cliente logado. É essa
// comparação — e não uma lista separada de turmas cadastradas — que
// autoriza o acesso: quem já abriu uma solicitação com aquele e-mail
// enxerga a task.
export async function buscarTasksPorEmail(email: string): Promise<TaskDoPortal[]> {
  const filtro = encodeURIComponent(
    JSON.stringify([{ field_id: CLICKUP_FIELD_EMAIL_CONTATO, operator: "=", value: email }])
  );

  const data = await clickupFetch(
    `/list/${env.CLICKUP_LIST_ID}/task?include_closed=true&custom_fields=${filtro}`,
    { method: "GET" }
  );

  const tasks: {
    id: string;
    name: string;
    url: string;
    status?: { status?: string };
    date_created?: string;
  }[] = data.tasks ?? [];

  // O endpoint de listagem não traz anexos — só o de task individual.
  // Busca o detalhe (com anexos) apenas das tasks já finalizadas, que são
  // as únicas onde o cliente precisa dos links de download.
  return Promise.all(
    tasks.map(async (task) => {
      const status = task.status?.status ?? "";
      const finalizada = status.toLowerCase() === env.CLICKUP_STATUS_FINALIZADO.toLowerCase();
      const anexos = finalizada ? (await buscarTaskDetalhada(task.id)).anexos : [];

      return {
        id: task.id,
        name: task.name,
        url: task.url,
        status,
        dataCriacao: task.date_created ?? "",
        anexos,
      };
    })
  );
}

export async function buscarTaskDetalhada(taskId: string): Promise<TaskDetalhada> {
  const task = await clickupFetch(
    `/task/${taskId}?include_subtasks=false`,
    { method: "GET" }
  );

  const customFields: { id: string; value?: unknown }[] = task.custom_fields ?? [];
  const campoEmail = customFields.find((campo) => campo.id === CLICKUP_FIELD_EMAIL_CONTATO);
  const campoTurma = customFields.find((campo) => campo.id === env.CLICKUP_FIELD_NOME_TURMA);

  return {
    id: task.id,
    name: task.name,
    url: task.url,
    listId: task.list?.id,
    turma: (campoTurma?.value as string | undefined) ?? task.name,
    emailContato: (campoEmail?.value as string | undefined) ?? null,
    anexos: (task.attachments ?? []).map((a: { title: string; url: string }) => ({
      title: a.title,
      url: a.url,
    })),
  };
}
