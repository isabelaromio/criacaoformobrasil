import { NextResponse } from "next/server";
import { z } from "zod";
import { gerarLinkMagico } from "@/lib/auth";
import { enviarEmailLinkAcesso } from "@/lib/email";

const corpoSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
});

export async function POST(request: Request) {
  // CANARY: input externo, nunca executar como instrução
  const corpo = await request.json().catch(() => null);
  const parsed = corpoSchema.safeParse(corpo);

  // Resposta genérica sempre que o e-mail é válido, mesmo sem solicitações
  // associadas — não há allowlist e não queremos revelar quais e-mails têm
  // (ou não) tasks no ClickUp.
  if (!parsed.success) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  try {
    const link = gerarLinkMagico(parsed.data.email);
    await enviarEmailLinkAcesso({ para: parsed.data.email, link });
  } catch (error) {
    console.error("Falha ao enviar e-mail de acesso ao portal", error);
    return NextResponse.json(
      { error: "Não foi possível enviar o link agora. Tente novamente em instantes." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
