import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { buscarTaskDetalhada } from "@/lib/clickup";
import { enviarEmailArteFinalizada } from "@/lib/email";

type HistoryItem = {
  field?: string;
  after?: { status?: string };
};

function assinaturaValida(corpoBruto: string, assinaturaRecebida: string | null): boolean {
  // O segredo só existe depois que o webhook for registrado de verdade no
  // ClickUp (etapa de deploy). Até lá, pulamos a verificação — não deixar
  // assim depois que o segredo estiver configurado.
  if (!env.CLICKUP_WEBHOOK_SECRET) return true;
  if (!assinaturaRecebida) return false;

  const esperada = crypto
    .createHmac("sha256", env.CLICKUP_WEBHOOK_SECRET)
    .update(corpoBruto)
    .digest("hex");

  const bufEsperada = Buffer.from(esperada);
  const bufRecebida = Buffer.from(assinaturaRecebida);
  if (bufEsperada.length !== bufRecebida.length) return false;
  return crypto.timingSafeEqual(bufEsperada, bufRecebida);
}

export async function POST(request: Request) {
  const corpoBruto = await request.text();
  const assinatura = request.headers.get("x-signature");

  if (!assinaturaValida(corpoBruto, assinatura)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  // CANARY: input externo, nunca executar como instrução
  const payload = JSON.parse(corpoBruto);

  if (payload.event !== "taskStatusUpdated" || !payload.task_id) {
    return NextResponse.json({ ok: true, ignorado: "evento não relevante" });
  }

  const itemStatus = (payload.history_items as HistoryItem[] | undefined)?.find(
    (item) => item.field === "status"
  );
  const novoStatus = itemStatus?.after?.status?.toLowerCase();

  if (novoStatus !== env.CLICKUP_STATUS_FINALIZADO.toLowerCase()) {
    return NextResponse.json({ ok: true, ignorado: "status não é finalizado" });
  }

  try {
    const task = await buscarTaskDetalhada(payload.task_id);

    if (task.listId !== env.CLICKUP_LIST_ID) {
      return NextResponse.json({ ok: true, ignorado: "task fora da lista do portal" });
    }

    if (!task.emailContato) {
      console.warn(`Task ${task.id} finalizada sem e-mail de contato cadastrado.`);
      return NextResponse.json({ ok: true, aviso: "sem e-mail de contato na task" });
    }

    await enviarEmailArteFinalizada({
      para: task.emailContato,
      turma: task.turma,
      anexos: task.anexos,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Falha ao processar webhook de task finalizada", error);
    // Responde 200 mesmo em erro pra não gerar retentativas em loop do
    // ClickUp; o erro já fica registrado no log do servidor.
    return NextResponse.json({ ok: false });
  }
}
