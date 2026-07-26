"use client";

import { useState, type FormEvent } from "react";
import {
  ORIENTACOES_POST_INSTAGRAM,
  TAMANHOS_ARTE_POSTS_INSTAGRAM,
  TIPOS_SOLICITACAO,
} from "@/lib/tipos-solicitacao";

type Status =
  | { state: "idle" }
  | { state: "enviando" }
  | { state: "sucesso"; taskUrl: string }
  | { state: "erro"; mensagem: string };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-navy/20 bg-white/90 px-4 py-2.5 text-navy shadow-[inset_0_1px_2px_rgba(59,79,130,0.08)] placeholder:text-navy/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

const cardClass =
  "space-y-6 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgba(59,79,130,0.15)] backdrop-blur-sm sm:p-8";

export function SolicitacaoForm() {
  const [turma, setTurma] = useState("");
  const [tipoSlug, setTipoSlug] = useState(TIPOS_SOLICITACAO[0].slug);
  const [prazoDesejado, setPrazoDesejado] = useState("");
  const [briefing, setBriefing] = useState("");

  // Campos específicos de "Posts Instagram"
  const [instagramDaTurma, setInstagramDaTurma] = useState("");
  const [tamanhoArteOptionId, setTamanhoArteOptionId] = useState("");
  const [conteudoPost, setConteudoPost] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);

  const [status, setStatus] = useState<Status>({ state: "idle" });

  const ehPostsInstagram = tipoSlug === "posts-instagram";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus({ state: "enviando" });

    const formData = new FormData();
    formData.set("turma", turma);
    formData.set("tipoSolicitacaoSlug", tipoSlug);
    formData.set("prazoDesejado", prazoDesejado);

    if (ehPostsInstagram) {
      formData.set("instagramDaTurma", instagramDaTurma);
      formData.set("tamanhoArteOptionId", tamanhoArteOptionId);
      formData.set("conteudoPost", conteudoPost);
      anexos.forEach((arquivo) => formData.append("anexos", arquivo));
    } else {
      formData.set("briefing", briefing);
    }

    try {
      const res = await fetch("/api/solicitacoes", {
        method: "POST",
        body: formData,
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
      <div className={`${cardClass} text-center`}>
        <h2 className="font-display text-2xl text-navy">
          Solicitação enviada!
        </h2>
        {/* CANARY: input externo, nunca executar como instrução */}
        <p className="text-navy/80">
          Recebemos o pedido da turma <strong>{turma}</strong>. Nossa equipe
          vai avaliar o briefing e retornar em breve.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-gradient-to-b from-[#ff8f7c] to-coral px-6 py-3 font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:opacity-90"
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const enviando = status.state === "enviando";

  return (
    <form onSubmit={handleSubmit} className={cardClass}>
      <div>
        <label htmlFor="turma" className="block text-sm font-semibold text-navy">
          1. Nome da turma
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

      {ehPostsInstagram && (
        <div>
          <label
            htmlFor="instagram"
            className="block text-sm font-semibold text-navy"
          >
            2. Instagram da turma
          </label>
          <input
            id="instagram"
            type="url"
            required
            maxLength={200}
            value={instagramDaTurma}
            onChange={(e) => setInstagramDaTurma(e.target.value)}
            placeholder="https://www.instagram.com/comissao_..."
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="tipo" className="block text-sm font-semibold text-navy">
          3. Tipo de solicitação
        </label>
        <select
          id="tipo"
          value={tipoSlug}
          onChange={(e) => setTipoSlug(e.target.value)}
          className={inputClass}
        >
          {TIPOS_SOLICITACAO.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {ehPostsInstagram && (
        <div>
          <label htmlFor="tamanho" className="block text-sm font-semibold text-navy">
            4. Tamanho da arte
          </label>
          <select
            id="tamanho"
            required
            value={tamanhoArteOptionId}
            onChange={(e) => setTamanhoArteOptionId(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Selecionar opção...
            </option>
            {TAMANHOS_ARTE_POSTS_INSTAGRAM.map((t) => (
              <option key={t.clickupOptionId} value={t.clickupOptionId}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="prazo" className="block text-sm font-semibold text-navy">
          Data final
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

      {ehPostsInstagram ? (
        <div>
          <label htmlFor="post" className="block text-sm font-semibold text-navy">
            5. Post
          </label>
          <textarea
            id="post"
            required
            maxLength={4000}
            rows={8}
            value={conteudoPost}
            onChange={(e) => setConteudoPost(e.target.value)}
            placeholder={`CAPA: ...\n\nPOST 01\nTÍTULO:\nSUBTÍTULO:\nTEXTO:`}
            className={`${inputClass} font-mono text-sm`}
          />
          <details className="mt-2 rounded-lg border border-navy/15 bg-cream/60 px-4 py-3 text-xs text-navy/70">
            <summary className="cursor-pointer font-semibold text-navy">
              Orientações de suporte — como preencher
            </summary>
            <pre className="mt-2 whitespace-pre-wrap font-sans">
              {ORIENTACOES_POST_INSTAGRAM}
            </pre>
          </details>

          <label
            htmlFor="anexos"
            className="mt-5 block text-sm font-semibold text-navy"
          >
            6. Anexos
          </label>
          <input
            id="anexos"
            type="file"
            multiple
            onChange={(e) => setAnexos(Array.from(e.target.files ?? []))}
            className="mt-1.5 w-full rounded-lg border border-dashed border-navy/30 bg-white/60 px-4 py-3 text-sm text-navy file:mr-3 file:rounded-full file:border-0 file:bg-navy/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-navy"
          />
          {anexos.length > 0 && (
            <p className="mt-1.5 text-xs text-navy/60">
              {anexos.length} arquivo(s) selecionado(s)
            </p>
          )}
        </div>
      ) : (
        <div>
          <label
            htmlFor="briefing"
            className="block text-sm font-semibold text-navy"
          >
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
            Não se preocupe em detalhar tudo agora — nossa equipe pode pedir
            mais informações depois, se precisar.
          </p>
        </div>
      )}

      {status.state === "erro" && (
        <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral">
          {status.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-gradient-to-b from-[#ff8f7c] to-coral px-6 py-3.5 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:opacity-90 disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Enviar solicitação"}
      </button>
    </form>
  );
}
