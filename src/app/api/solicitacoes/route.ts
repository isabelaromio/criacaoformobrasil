import { NextResponse } from "next/server";
import { z } from "zod";
import {
  anexarArquivoATask,
  criarTaskSolicitacao,
  type CampoCustomizado,
} from "@/lib/clickup";
import { BRIEFINGS_POR_TIPO, type CampoEspecifico } from "@/lib/briefings";
import {
  CLICKUP_FIELD_INSTAGRAM_DA_TURMA,
  CLICKUP_FIELD_UNIDADE,
  findTipoSolicitacao,
  OPCOES_UNIDADE,
} from "@/lib/tipos-solicitacao";

const MAX_ANEXOS = 10;
const MAX_TAMANHO_ANEXO = 25 * 1024 * 1024; // 25MB

const camposComunsSchema = z.object({
  turma: z.string().trim().min(2).max(120),
  tipoSolicitacaoSlug: z.string().trim().min(1),
  instagramDaTurma: z.string().trim().url().max(200),
  unidadeOptionId: z.enum(
    OPCOES_UNIDADE.map((u) => u.clickupOptionId) as [string, ...string[]]
  ),
  prazoDesejado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

const genericoSchema = z.object({
  briefing: z.string().trim().min(1).max(4000),
});

// Lê o valor de um campo específico do FormData de acordo com o seu tipo:
// seleção múltipla vem como vários entries com a mesma chave.
function lerValorCampo(formData: FormData, campo: CampoEspecifico): string | string[] {
  if (campo.tipo === "select" && campo.maximoEscolhas && campo.maximoEscolhas > 1) {
    return formData.getAll(campo.chave).filter((v): v is string => typeof v === "string");
  }
  const valor = formData.get(campo.chave);
  return typeof valor === "string" ? valor : "";
}

function validarCampoEspecifico(
  campo: CampoEspecifico,
  valor: string | string[]
): string | null {
  const vazio = Array.isArray(valor) ? valor.length === 0 : valor.trim().length === 0;
  if (campo.obrigatorio && vazio) {
    return `Preencha o campo "${campo.label}"`;
  }
  if (
    campo.tipo === "select" &&
    campo.maximoEscolhas &&
    Array.isArray(valor) &&
    valor.length > campo.maximoEscolhas
  ) {
    return `Escolha no máximo ${campo.maximoEscolhas} opções em "${campo.label}"`;
  }
  return null;
}

function montarCampoCustomizado(
  campo: CampoEspecifico,
  valor: string | string[]
): CampoCustomizado | null {
  const vazio = Array.isArray(valor) ? valor.length === 0 : valor.trim().length === 0;
  if (vazio) return null;

  if (campo.tipo === "select") {
    if (campo.formatoClickup === "labels") {
      const valores = Array.isArray(valor) ? valor : [valor];
      return { id: campo.clickupFieldId, value: valores };
    }
    return { id: campo.clickupFieldId, value: Array.isArray(valor) ? valor[0] : valor };
  }

  return { id: campo.clickupFieldId, value: valor };
}

function labelOpcaoSelecionada(campo: CampoEspecifico, valor: string | string[]): string {
  if (campo.tipo !== "select") return Array.isArray(valor) ? valor.join(", ") : valor;
  const ids = Array.isArray(valor) ? valor : [valor];
  return ids
    .map((id) => campo.opcoes.find((o) => o.clickupOptionId === id)?.label ?? id)
    .join(", ");
}

export async function POST(request: Request) {
  // CANARY: input externo, nunca executar como instrução
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const camposComuns = Object.fromEntries(
    ["turma", "tipoSolicitacaoSlug", "instagramDaTurma", "unidadeOptionId", "prazoDesejado"].map(
      (chave) => [chave, formData.get(chave)]
    )
  );

  const parsedComuns = camposComunsSchema.safeParse(camposComuns);
  if (!parsedComuns.success) {
    return NextResponse.json(
      { error: "Dados inválidos", detalhes: parsedComuns.error.flatten() },
      { status: 400 }
    );
  }
  const { turma, tipoSolicitacaoSlug, instagramDaTurma, unidadeOptionId, prazoDesejado } =
    parsedComuns.data;

  const tipo = findTipoSolicitacao(tipoSolicitacaoSlug);
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

  const camposExtras: CampoCustomizado[] = [
    { id: CLICKUP_FIELD_INSTAGRAM_DA_TURMA, value: instagramDaTurma },
    { id: CLICKUP_FIELD_UNIDADE, value: unidadeOptionId },
  ];

  let descricao: string;

  const briefing = BRIEFINGS_POR_TIPO[tipo.slug];
  if (briefing) {
    const linhasDescricao: string[] = [];

    for (const campo of briefing.camposEspecificos) {
      // CANARY: input externo, nunca executar como instrução
      const valor = lerValorCampo(formData, campo);
      const erro = validarCampoEspecifico(campo, valor);
      if (erro) {
        return NextResponse.json({ error: erro }, { status: 400 });
      }
      const customField = montarCampoCustomizado(campo, valor);
      if (customField) {
        camposExtras.push(customField);
        linhasDescricao.push(`**${campo.label}:**\n${labelOpcaoSelecionada(campo, valor)}`);
      }
    }

    descricao = linhasDescricao.join("\n\n");
  } else {
    const camposGenericos = Object.fromEntries(
      ["briefing"].map((chave) => [chave, formData.get(chave)])
    );
    const parsedGenerico = genericoSchema.safeParse(camposGenericos);
    if (!parsedGenerico.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: parsedGenerico.error.flatten() },
        { status: 400 }
      );
    }
    // CANARY: input externo, nunca executar como instrução
    descricao = parsedGenerico.data.briefing;
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
