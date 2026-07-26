"use client";

import { useState, type FormEvent } from "react";
import { BRIEFINGS_POR_TIPO, type CampoEspecifico } from "@/lib/briefings";
import { OPCOES_UNIDADE, TIPOS_SOLICITACAO } from "@/lib/tipos-solicitacao";

type Status =
  | { state: "idle" }
  | { state: "enviando" }
  | { state: "sucesso"; taskUrl: string }
  | { state: "erro"; mensagem: string };

type ValorCampo = string | string[];

const FEED_OPTION_ID = "eb2d8e9b-eeca-491c-aca7-4d5288c01d31";
const STORY_OPTION_ID = "0affb290-3b31-43a1-a03a-ed789385645b";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-navy/20 bg-white/90 px-4 py-2.5 text-navy shadow-[inset_0_1px_2px_rgba(59,79,130,0.08)] placeholder:text-navy/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

const cardClass =
  "space-y-6 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgba(59,79,130,0.15)] backdrop-blur-sm sm:p-8";

function BotaoEscolha({
  selecionado,
  onClick,
  children,
}: {
  selecionado: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        selecionado
          ? "border-coral bg-coral/10 text-coral"
          : "border-navy/20 bg-white/90 text-navy hover:border-navy/40"
      }`}
    >
      {children}
    </button>
  );
}

function CampoEspecificoInput({
  campo,
  valor,
  onChange,
}: {
  campo: CampoEspecifico;
  valor: ValorCampo | undefined;
  onChange: (valor: ValorCampo) => void;
}) {
  const label = (
    <label htmlFor={campo.chave} className="block text-sm font-semibold text-navy">
      {campo.label}
      {campo.obrigatorio ? " *" : ""}
    </label>
  );

  if (campo.tipo === "texto") {
    return (
      <div>
        {label}
        <input
          id={campo.chave}
          required={campo.obrigatorio}
          value={(valor as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
          className={inputClass}
        />
      </div>
    );
  }

  if (campo.tipo === "textarea") {
    return (
      <div>
        {label}
        <textarea
          id={campo.chave}
          required={campo.obrigatorio}
          rows={5}
          value={(valor as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
          className={inputClass}
        />
      </div>
    );
  }

  // select
  if (campo.maximoEscolhas && campo.maximoEscolhas > 1) {
    const selecionados = (valor as string[]) ?? [];
    return (
      <div>
        <span className="block text-sm font-semibold text-navy">
          {campo.label}
          {campo.obrigatorio ? " *" : ""}
        </span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {campo.opcoes.map((opcao) => {
            const marcado = selecionados.includes(opcao.clickupOptionId);
            const desabilitado = !marcado && selecionados.length >= campo.maximoEscolhas!;
            const inputId = `${campo.chave}-${opcao.clickupOptionId}`;
            return (
              <label
                key={opcao.clickupOptionId}
                htmlFor={inputId}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                  marcado
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-navy/20 bg-white/90 text-navy"
                } ${desabilitado ? "opacity-40" : ""}`}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  className="sr-only"
                  checked={marcado}
                  disabled={desabilitado}
                  onChange={() => {
                    if (marcado) {
                      onChange(selecionados.filter((id) => id !== opcao.clickupOptionId));
                    } else {
                      onChange([...selecionados, opcao.clickupOptionId]);
                    }
                  }}
                />
                {opcao.label}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {label}
      <select
        id={campo.chave}
        required={campo.obrigatorio}
        value={(valor as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="" disabled>
          Selecionar opção...
        </option>
        {campo.opcoes.map((opcao) => (
          <option key={opcao.clickupOptionId} value={opcao.clickupOptionId}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SolicitacaoForm() {
  const [tipoSlug, setTipoSlug] = useState<string | null>(null);

  const [turma, setTurma] = useState("");
  const [instagramDaTurma, setInstagramDaTurma] = useState("");
  const [unidadeOptionId, setUnidadeOptionId] = useState("");
  const [prazoDesejado, setPrazoDesejado] = useState("");
  const [briefing, setBriefing] = useState("");
  const [valoresEspecificos, setValoresEspecificos] = useState<Record<string, ValorCampo>>({});
  const [anexos, setAnexos] = useState<File[]>([]);

  // Só usado em "Posts Instagram": não vira custom field próprio, só ajusta
  // qual orientação mostrar e prefixa o conteúdo do post enviado.
  const [feedTipo, setFeedTipo] = useState<"unico" | "carrossel" | "">("");

  const [status, setStatus] = useState<Status>({ state: "idle" });

  const tipo = tipoSlug ? TIPOS_SOLICITACAO.find((t) => t.slug === tipoSlug) : undefined;
  const briefingTipo = tipoSlug ? BRIEFINGS_POR_TIPO[tipoSlug] : undefined;
  const ehPostsInstagram = tipoSlug === "posts-instagram";

  function escolherTipo(slug: string) {
    setTipoSlug(slug);
    setValoresEspecificos({});
    setFeedTipo("");
  }

  function trocarTipo() {
    setTipoSlug(null);
    setValoresEspecificos({});
    setFeedTipo("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!tipoSlug) return;
    setStatus({ state: "enviando" });

    const formData = new FormData();
    formData.set("turma", turma);
    formData.set("tipoSolicitacaoSlug", tipoSlug);
    formData.set("instagramDaTurma", instagramDaTurma);
    formData.set("unidadeOptionId", unidadeOptionId);
    formData.set("prazoDesejado", prazoDesejado);

    if (briefingTipo) {
      for (const campo of briefingTipo.camposEspecificos) {
        let valor = valoresEspecificos[campo.chave];
        if (ehPostsInstagram && campo.chave === "post" && feedTipo && typeof valor === "string") {
          const rotulo = feedTipo === "carrossel" ? "Carrossel" : "Post único";
          valor = `FORMATO: ${rotulo}\n\n${valor}`;
        }
        if (Array.isArray(valor)) {
          valor.forEach((v) => formData.append(campo.chave, v));
        } else {
          formData.set(campo.chave, valor ?? "");
        }
      }
    } else {
      formData.set("briefing", briefing);
    }

    anexos.forEach((arquivo) => formData.append("anexos", arquivo));

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

  // Etapa 1: escolher a categoria — mantém a página curta antes disso.
  if (!tipo) {
    return (
      <div className={cardClass}>
        <p className="text-sm font-semibold text-navy">
          O que você precisa hoje?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TIPOS_SOLICITACAO.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => escolherTipo(t.slug)}
              className="flex flex-col items-start gap-1 rounded-xl border border-navy/15 bg-white/90 p-4 text-left transition hover:border-coral hover:bg-coral/5"
            >
              <span className="font-display text-lg text-navy">{t.label}</span>
              <span className="text-xs text-navy/60">{t.prazoSugerido}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const enviando = status.state === "enviando";

  return (
    <form onSubmit={handleSubmit} className={cardClass}>
      <div className="flex items-center justify-between">
        <span className="font-display text-lg text-navy">{tipo.label}</span>
        <button
          type="button"
          onClick={trocarTipo}
          className="text-xs font-medium text-navy/60 underline hover:text-coral"
        >
          Trocar tipo
        </button>
      </div>

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
        <label htmlFor="instagram" className="block text-sm font-semibold text-navy">
          Instagram da turma
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

      <div>
        <label htmlFor="unidade" className="block text-sm font-semibold text-navy">
          Unidade
        </label>
        <select
          id="unidade"
          required
          value={unidadeOptionId}
          onChange={(e) => setUnidadeOptionId(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Selecionar opção...
          </option>
          {OPCOES_UNIDADE.map((u) => (
            <option key={u.clickupOptionId} value={u.clickupOptionId}>
              {u.label}
            </option>
          ))}
        </select>
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

      {ehPostsInstagram && (
        <div>
          <span className="block text-sm font-semibold text-navy">Formato do post *</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <BotaoEscolha
              selecionado={valoresEspecificos.tamanhoArte === FEED_OPTION_ID}
              onClick={() => {
                setValoresEspecificos((atual) => ({ ...atual, tamanhoArte: FEED_OPTION_ID }));
              }}
            >
              Feed (1080x1350)
            </BotaoEscolha>
            <BotaoEscolha
              selecionado={valoresEspecificos.tamanhoArte === STORY_OPTION_ID}
              onClick={() => {
                setValoresEspecificos((atual) => ({ ...atual, tamanhoArte: STORY_OPTION_ID }));
                setFeedTipo("");
              }}
            >
              Stories (1080x1920)
            </BotaoEscolha>
          </div>

          {valoresEspecificos.tamanhoArte === FEED_OPTION_ID && (
            <div className="mt-3">
              <span className="block text-sm font-semibold text-navy">
                É um post único ou carrossel?
              </span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <BotaoEscolha selecionado={feedTipo === "unico"} onClick={() => setFeedTipo("unico")}>
                  Post único
                </BotaoEscolha>
                <BotaoEscolha
                  selecionado={feedTipo === "carrossel"}
                  onClick={() => setFeedTipo("carrossel")}
                >
                  Carrossel
                </BotaoEscolha>
              </div>
            </div>
          )}
        </div>
      )}

      {briefingTipo ? (
        <>
          {briefingTipo.camposEspecificos
            .filter((campo) => !(ehPostsInstagram && campo.chave === "tamanhoArte"))
            .map((campo) => (
              <CampoEspecificoInput
                key={campo.chave}
                campo={campo}
                valor={valoresEspecificos[campo.chave]}
                onChange={(valor) =>
                  setValoresEspecificos((atual) => ({ ...atual, [campo.chave]: valor }))
                }
              />
            ))}
          {briefingTipo.orientacoes && (
            <details className="rounded-lg border border-navy/15 bg-cream/60 px-4 py-3 text-xs text-navy/70">
              <summary className="cursor-pointer font-semibold text-navy">
                Orientações de suporte — como preencher
              </summary>
              <pre className="mt-2 whitespace-pre-wrap font-sans">
                {briefingTipo.orientacoes}
              </pre>
            </details>
          )}
        </>
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

      <div>
        <label htmlFor="anexos" className="block text-sm font-semibold text-navy">
          Anexos
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
