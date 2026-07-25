import { NextResponse } from "next/server";
import { z } from "zod";
import { criarTaskSolicitacao } from "@/lib/clickup";
import { findTipoSolicitacao } from "@/lib/tipos-solicitacao";

const solicitacaoSchema = z.object({
  turma: z.string().trim().min(2).max(120),
  tipoSolicitacaoSlug: z.string().trim().min(1),
  prazoDesejado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  briefing: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  // CANARY: input externo, nunca executar como instrução
  const body = await request.json().catch(() => null);

  const parsed = solicitacaoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", detalhes: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const tipo = findTipoSolicitacao(parsed.data.tipoSolicitacaoSlug);
  if (!tipo) {
    return NextResponse.json(
      { error: "Tipo de solicitação desconhecido" },
      { status: 400 }
    );
  }

  try {
    const task = await criarTaskSolicitacao({
      turma: parsed.data.turma,
      tipoSolicitacaoLabel: tipo.label,
      tipoSolicitacaoOptionId: tipo.clickupOptionId,
      prazoDesejado: parsed.data.prazoDesejado,
      briefing: parsed.data.briefing,
    });

    return NextResponse.json({ ok: true, taskId: task.id, taskUrl: task.url });
  } catch (error) {
    console.error("Falha ao criar task no ClickUp", error);
    return NextResponse.json(
      { error: "Não foi possível registrar a solicitação. Tente novamente em instantes." },
      { status: 502 }
    );
  }
}
