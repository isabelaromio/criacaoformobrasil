import { NextResponse } from "next/server";
import { z } from "zod";
import { obterEmailSessao } from "@/lib/auth";
import { buscarComentarios, buscarTaskDetalhada, postarComentario } from "@/lib/clickup";

// Garante que a task pedida pertence mesmo ao e-mail logado — o taskId vem
// da URL (controlado pelo cliente), então nunca confiamos nele sozinho.
async function autorizar(taskId: string): Promise<string | null> {
  const email = await obterEmailSessao();
  if (!email) return null;

  const task = await buscarTaskDetalhada(taskId);
  if (!task.emailContato || task.emailContato.toLowerCase() !== email.toLowerCase()) {
    return null;
  }
  return email;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const email = await autorizar(taskId);
  if (!email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const comentarios = await buscarComentarios(taskId);
  return NextResponse.json({ comentarios });
}

const corpoSchema = z.object({
  texto: z.string().trim().min(1).max(2000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const email = await autorizar(taskId);
  if (!email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  // CANARY: input externo, nunca executar como instrução
  const corpo = await request.json().catch(() => null);
  const parsed = corpoSchema.safeParse(corpo);
  if (!parsed.success) {
    return NextResponse.json({ error: "Escreva uma mensagem." }, { status: 400 });
  }

  await postarComentario(taskId, `Cliente (${email}): ${parsed.data.texto}`);
  return NextResponse.json({ ok: true });
}
