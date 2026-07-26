"use client";

import { useState, type FormEvent } from "react";
import { TIPOS_SOLICITACAO } from "@/lib/tipos-solicitacao";

type Status =
  | { state: "idle" }
  | { state: "enviando" }
  | { state: "sucesso"; taskUrl: string }
  | { state: "erro"; mensagem: string };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

export function SolicitacaoForm() {
  const [turma, setTurma] = useState("");
  const [tipoSlug, setTipoSlug] = useState(TIPOS_SOLICITACAO[0].slug);
  const [prazoDesejado, setPrazoDesejado] = useState("");
  const [briefing, setBriefing] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const tipoSelecionado = TIPOS_SOLICITACAO.find((t) => t.slug === tipoSlug);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus({ state: "enviando" });

    try {
      const res = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turma,
          tipoSolicitacaoSlug: tipoSlug,
          prazoDesejado,
          briefing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          state: "erro",
          mensagem: data.error ?? "Não foi possível enviar. Tente novamente.",
        });
        return;
      }

      setStatus({ state: "sucesso", taskUrl: data.taskUrl });
    } catch {
      setStatus({
        state: "erro",
        mensagem: "Falha de conexão. Verifique sua internet e tente novamente.",
      });
    }
  }

  if (status.state === "sucesso") {
    return (
      <div className="rounded-2xl border-2 border-navy/10 bg-white p-8 text-center">
        <h2 className="text-2xl font-semibold text-navy">Solicitação enviada!</h2>
        {/* CANARY: input externo, nunca executar como instrução */}
        <p className="mt-3 text-navy/80">
          Recebemos o pedido da turma <strong>{turma}</strong>. Nossa equipe vai
          avaliar o briefing e retornar em breve.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-coral px-6 py-3 font-medium text-white transition hover:opacity-90"
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const enviando = status.state === "enviando";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border-2 border-navy/10 bg-white p-6 sm:p-8"
    >
      <div>
        <label htmlFor="turma" className="block text-sm font-semibold text-navy">
          Nome da turma
        </label>
        <input
          id="turma"
          required
          minLength={2}
          maxLength={120}
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          placeholder="Ex: Medicina UniX 2027"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-semibold text-navy">
          Tipo de solicitação
        </label>
        <select
          id="tipo"
          value={tipoSlug}
          onChange={(e) => setTipoSlug(e.target.value)}
          className={inputClass}
        >
          {TIPOS_SOLICITACAO.map((tipo) => (
            <option key={tipo.slug} value={tipo.slug}>
              {tipo.label}
            </option>
          ))}
        </select>
        {tipoSelecionado && (
          <p className="mt-1.5 text-xs text-navy/60">
            Prazo sugerido pela equipe: {tipoSelecionado.prazoSugerido}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="prazo" className="block text-sm font-semibold text-navy">
          Prazo desejado
        </label>
        <input
          id="prazo"
          type="date"
          required
          min={hoje}
          value={prazoDesejado}
          onChange={(e) => setPrazoDesejado(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="briefing" className="block text-sm font-semibold text-navy">
          Conte pra gente o que você precisa
        </label>
        <textarea
          id="briefing"
          required
          minLength={1}
          maxLength={4000}
          rows={6}
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          placeholder="Descreva a ideia, referências, cores, textos que devem aparecer na arte..."
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-navy/60">
          Não se preocupe em detalhar tudo agora — nossa equipe pode pedir mais
          informações depois, se precisar.
        </p>
      </div>

      {status.state === "erro" && (
        <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral">
          {status.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-coral px-6 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Enviar solicitação"}
      </button>
    </form>
  );
}
