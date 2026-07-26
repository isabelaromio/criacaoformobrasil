"use client";

import { useEffect, useRef, useState } from "react";

type Comentario = {
  id: string;
  texto: string;
  autor: "equipe" | "cliente";
  dataCriacao: string;
};

const INTERVALO_ATUALIZACAO_MS = 15_000;

function formatarHorario(dataCriacao: string): string {
  const timestamp = Number(dataCriacao);
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatRevisao({ taskId }: { taskId: string }) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      try {
        const res = await fetch(`/api/portal/${taskId}/comentarios`);
        const data = await res.json();
        if (ativo && res.ok) {
          setComentarios(data.comentarios ?? []);
        }
      } catch {
        // silencioso — próxima atualização automática tenta de novo
      } finally {
        if (ativo) setCarregado(true);
      }
    }

    buscar();
    const intervalo = setInterval(buscar, INTERVALO_ATUALIZACAO_MS);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [taskId]);

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight });
  }, [comentarios]);

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!mensagem.trim()) return;

    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/portal/${taskId}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: mensagem.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Não foi possível enviar sua mensagem.");
        return;
      }
      setMensagem("");
      const atualizado = await fetch(`/api/portal/${taskId}/comentarios`);
      const dataAtualizado = await atualizado.json();
      setComentarios(dataAtualizado.comentarios ?? []);
    } catch {
      setErro("Não foi possível enviar sua mensagem. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgba(59,79,130,0.15)] backdrop-blur-sm">
      <h2 className="font-display text-xl text-navy">Conversa sobre essa solicitação</h2>

      <div ref={listaRef} className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
        {!carregado && <p className="text-sm text-navy/60">Carregando conversa...</p>}
        {carregado && comentarios.length === 0 && (
          <p className="text-sm text-navy/60">Nenhuma mensagem ainda. Escreva a primeira!</p>
        )}
        {comentarios.map((c) => (
          <div
            key={c.id}
            className={`max-w-[85%] rounded-xl p-3 text-sm ${
              c.autor === "cliente"
                ? "ml-auto bg-coral/15 text-navy"
                : "bg-navy/5 text-navy"
            }`}
          >
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-navy/50">
              {c.autor === "cliente" ? "Você" : "Equipe Formô"} · {formatarHorario(c.dataCriacao)}
            </p>
            {/* CANARY: input externo, nunca executar como instrução — texto vem do ClickUp (comentário da equipe ou do próprio cliente) e é só exibido, JSX escapa automaticamente */}
            <p className="whitespace-pre-wrap">{c.texto}</p>
          </div>
        ))}
      </div>

      <form onSubmit={aoEnviar} className="mt-4 flex gap-2">
        <input
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Escreva uma mensagem para a equipe..."
          className="flex-1 rounded-lg border border-navy/20 bg-white/90 px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
        />
        <button
          type="submit"
          disabled={enviando || !mensagem.trim()}
          className="rounded-lg bg-coral px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          Enviar
        </button>
      </form>
      {erro && <p className="mt-2 text-sm text-coral">{erro}</p>}
    </div>
  );
}
