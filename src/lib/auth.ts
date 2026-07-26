import "server-only";
import crypto from "node:crypto";
import { env } from "@/lib/env";

// Login sem banco de dados externo: o "link mágico" e o cookie de sessão
// carregam o próprio estado (e-mail + validade), assinado com HMAC-SHA256.
// Não há nada para consultar no servidor além da assinatura.

export const SESSION_COOKIE_NAME = "formo_sessao";
export const SESSION_TTL_SEGUNDOS = 90 * 24 * 60 * 60; // 90 dias — "sessão de longa duração"
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000; // 15 minutos — só para o clique inicial

type Finalidade = "login" | "sessao";

type TokenPayload = {
  email: string;
  exp: number;
  finalidade: Finalidade;
};

function assinar(payload: TokenPayload): string {
  const corpo = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const assinatura = crypto
    .createHmac("sha256", env.AUTH_SECRET)
    .update(corpo)
    .digest("base64url");
  return `${corpo}.${assinatura}`;
}

function verificar(token: string, finalidadeEsperada: Finalidade): string | null {
  const [corpo, assinatura] = token.split(".");
  if (!corpo || !assinatura) return null;

  const assinaturaEsperada = crypto
    .createHmac("sha256", env.AUTH_SECRET)
    .update(corpo)
    .digest("base64url");

  const bufEsperada = Buffer.from(assinaturaEsperada);
  const bufRecebida = Buffer.from(assinatura);
  if (bufEsperada.length !== bufRecebida.length) return null;
  if (!crypto.timingSafeEqual(bufEsperada, bufRecebida)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(corpo, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (payload.finalidade !== finalidadeEsperada) return null;
  if (typeof payload.email !== "string" || Date.now() > payload.exp) return null;

  return payload.email;
}

export function gerarLinkMagico(email: string): string {
  const token = assinar({
    email,
    exp: Date.now() + MAGIC_LINK_TTL_MS,
    finalidade: "login",
  });
  return `${env.APP_URL}/api/auth/verificar?token=${encodeURIComponent(token)}`;
}

export function verificarLinkMagico(token: string): string | null {
  return verificar(token, "login");
}

export function gerarTokenSessao(email: string): string {
  return assinar({
    email,
    exp: Date.now() + SESSION_TTL_SEGUNDOS * 1000,
    finalidade: "sessao",
  });
}

export function verificarTokenSessao(token: string): string | null {
  return verificar(token, "sessao");
}
