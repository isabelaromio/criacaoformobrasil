# Portal de Solicitações Formô Brasil

App Next.js (App Router) que permite à comissão de formatura solicitar arte diretamente
(sem WhatsApp), acompanhar o status e receber a entrega, com tudo sincronizado com a
lista **Solicitações Criação Formô** no ClickUp (Space "Formô | Criação").

## Como rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha os valores reais no .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Nunca** cole valores do `.env.local` na conversa com o Claude Code — preencha o arquivo
diretamente. Chaves de API (ClickUp, e-mail transacional) só existem em variáveis de
ambiente lidas em rotas de servidor (`src/lib/*`, `src/app/api/**/route.ts`) — nunca em
componentes de cliente.

## Decisões de arquitetura já tomadas

- **Fluxo interno do ClickUp**: não é alterado. O portal só cria/lê tasks na lista já
  existente.
- **Login do cliente**: magic link por e-mail, restrito a uma allowlist de e-mails por
  turma (sem senha, sem signup aberto).
- **Formulário do cliente**: versão enxuta (tipo de arte, turma, prazo desejado, briefing
  livre). A equipe completa o restante no estágio "Aguardando informações" já existente.
- **Fonte de verdade para turma ↔ e-mails autorizados**: ClickUp (lista dedicada, a ser
  criada antes da etapa de autenticação) — sem banco de dados externo.

## Estrutura

- `src/lib/env.ts` — leitura/validação de variáveis de ambiente de servidor.
- `src/lib/clickup.ts` — cliente ClickUp (server-only), usado pelas rotas de API.
- `src/lib/tipos-solicitacao.ts` — taxonomia de "tipo de arte" espelhando o custom field
  `03. Tipo de Solicitação` do ClickUp (sem dados sensíveis, importável no cliente).
- `src/app/api/solicitacoes/route.ts` — `POST` que cria a task no ClickUp a partir dos
  dados do formulário do cliente.

## IDs do ClickUp usados

Resolvidos via API a partir dos nomes reais informados no brief (Space "Formô | Criação",
lista "Solicitações Criação Formô") — ver `.env.local.example` para os valores.

## Ordem de build (não pular etapas)

1. ✅ Esqueleto do projeto
2. ✅ Rota de criação de task no ClickUp (testada com task real, criada e apagada em
   seguida — ver histórico da sessão)
3. ⏳ Formulário do cliente
4. ⏳ Webhook "Finalizado" → e-mail de entrega
5. ⏳ Autenticação do cliente (magic link + allowlist)
6. ⏳ Sincronização do chat com comentários da task
7. ⏳ Teste ponta a ponta local
8. ⏳ Deploy em produção
