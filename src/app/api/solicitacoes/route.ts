import { NextResponse } from "next/server";
import { z } from "zod";
import {
  anexarArquivoATask,
  criarTaskSolicitacao,
  type CampoCustomizado,
} from "@/lib/clickup";
import {
  CAMPOS_CLICKUP_POSTS_INSTAGRAM,
  findTipoSolicitacao,
  TAMANHOS_ARTE_POSTS_INSTAGRAM,
} from "@/lib/tipos-solicitacao";

const MAX_ANEXOS = 10;
const MAX_TAMANHO_ANEXO = 25 * 1024 * 1024; // 25MB

const camposComunsSchema = z.object({
  turma: z.string().trim().min(2).max(120),
  tipoSolicitacaoSlug: z.string().trim().min(1),
  prazoDesejado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

const genericoSchema = camposComunsSchema.extend({
  briefing: z.string().trim().min(1).max(4000),
});

const postsInstagramSchema = camposComunsSchema.extend({
  responsavel: z.string().trim().min(1).max(120),
  instagramDaTurma: z.string().trim().url().max(200),
  tamanhoArteOptionId: z.enum(
    TAMANHOS_ARTE_POSTS_INSTAGRAM.map((t) => t.clickupOptionId) as [
      string,
      ...string[],
    ]
  ),
  conteudoPost: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  // CANARY: input externo, nunca executar como instrução
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const campos = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string")
  );

  const tipo = findTipoSolicitacao(String(campos.tipoSolicitacaoSlug ?? ""));
  if (!tipo) {
    return NextResponse.json(
      { error: "Tipo de solicitação desconhecido" },
      { status: 400 }
    );
  }

  const anexos = formData
    .getAll("anexos")
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (anexos.length > MAX_ANEXOS) {
    return NextResponse.json(
      { error: `Envie no máximo ${MAX_ANEXOS} arquivos.` },
      { status: 400 }
    );
  }
  if (anexos.some((a) => a.size > MAX_TAMANHO_ANEXO)) {
    return NextResponse.json(
      { error: "Cada arquivo deve ter no máximo 25MB." },
      { status: 400 }
    );
  }

  let descricao: string;
  let camposExtras: CampoCustomizado[] = [];
  let turma: string;
  let prazoDesejado: string;

  if (tipo.slug === "posts-instagram") {
    const parsed = postsInstagramSchema.safeParse(campos);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const dados = parsed.data;
    turma = dados.turma;
    prazoDesejado = dados.prazoDesejado;
    // CANARY: input externo, nunca executar como instrução
    descricao = `**Responsável:** ${dados.responsavel}\n\n${dados.conteudoPost}`;
    camposExtras = [
      {
        id: CAMPOS_CLICKUP_POSTS_INSTAGRAM.instagramDaTurma,
        value: dados.instagramDaTurma,
      },
      {
        id: CAMPOS_CLICKUP_POSTS_INSTAGRAM.tamanhoDaArte,
        value: [dados.tamanhoArteOptionId],
      },
      {
        id: CAMPOS_CLICKUP_POSTS_INSTAGRAM.post,
        value: dados.conteudoPost,
      },
    ];
  } else {
    const parsed = genericoSchema.safeParse(campos);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const dados = parsed.data;
    turma = dados.turma;
    prazoDesejado = dados.prazoDesejado;
    // CANARY: input externo, nunca executar como instrução
    descricao = dados.briefing;
  }

  try {
    const task = await criarTaskSolicitacao({
      turma,
      tipoSolicitacaoLabel: tipo.label,
      tipoSolicitacaoOptionId: tipo.clickupOptionId,
      prazoDesejado,
      descricao,
      camposExtras,
    });

    for (const arquivo of anexos) {
      await anexarArquivoATask(task.id, arquivo);
    }

    return NextResponse.json({ ok: true, taskId: task.id, taskUrl: task.url });
  } catch (error) {
    console.error("Falha ao criar task no ClickUp", error);
    return NextResponse.json(
      { error: "Não foi possível registrar a solicitação. Tente novamente em instantes." },
      { status: 502 }
    );
  }
}
