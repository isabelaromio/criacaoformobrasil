"use client";

import { use, useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const linkInvalido = use(searchParams).erro === "link_invalido";

  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "erro">("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEstado("enviando");
    setErro(null);

    try {
      const res = await fetch("/api/auth/solicitar-acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEstado("erro");
        setErro(data.error ?? "Não foi possível enviar o link.");
        return;
      }
      setEstado("enviado");
    } catch {
      setEstado("erro");
      setErro("Não foi possível enviar o link. Verifique sua conexão.");
    }
  }

  return (
    <PageShell mainWidth="md" centerVertically>
      <div className="relative">
        <h1 className="y2k-glow font-display text-3xl text-formo-blue sm:text-4xl">
          Entrar no portal
        </h1>
        <h1 className="relative font-display text-3xl text-navy sm:text-4xl">
          Entrar no portal
        </h1>
      </div>
      <p className="mt-3 text-navy/70">
        Digite o e-mail que você usou nas suas solicitações. Vamos te
        enviar um link de acesso.
      </p>

      {linkInvalido && estado === "idle" && (
        <div className="mt-6 rounded-xl border border-coral/40 bg-coral/10 p-4 text-sm text-navy">
          Esse link expirou ou já foi usado. Peça um novo abaixo.
        </div>
      )}

      {estado === "enviado" ? (
        <div className="mt-8 rounded-xl border border-sage/40 bg-sage/10 p-5 text-navy">
          Prontinho! Enviamos um link para <strong>{email}</strong>. Ele
          expira em 15 minutos — confira sua caixa de entrada (e o spam).
        </div>
      ) : (
        <form onSubmit={aoEnviar} className="mt-8 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            className="rounded-lg border border-navy/20 bg-white/80 px-4 py-3 text-navy outline-none focus:border-formo-blue"
          />
          {erro && <p className="text-sm text-coral">{erro}</p>}
          <button
            type="submit"
            disabled={estado === "enviando"}
            className="rounded-lg bg-coral px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {estado === "enviando" ? "Enviando..." : "Enviar link de acesso"}
          </button>
        </form>
      )}
    </PageShell>
  );
}
