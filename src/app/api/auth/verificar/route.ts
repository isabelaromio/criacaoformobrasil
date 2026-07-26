import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_TTL_SEGUNDOS, gerarTokenSessao, verificarLinkMagico } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const email = token ? verificarLinkMagico(token) : null;
  if (!email) {
    return NextResponse.redirect(new URL("/login?erro=link_invalido", request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, gerarTokenSessao(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SEGUNDOS,
  });

  return NextResponse.redirect(new URL("/portal", request.url));
}
