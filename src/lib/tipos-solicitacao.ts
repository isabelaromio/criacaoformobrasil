// Espelha as opções do custom field "03. Tipo de Solicitação" da lista
// "Solicitações Criação Formô" no ClickUp. Sem dados sensíveis — pode ser
// importado tanto em código de servidor quanto em componentes de cliente.
export type TipoSolicitacao = {
  slug: string;
  label: string;
  prazoSugerido: string;
  clickupOptionId: string;
};

export const TIPOS_SOLICITACAO: TipoSolicitacao[] = [
  { slug: "posts-instagram", label: "Posts Instagram", prazoSugerido: "7 dias úteis", clickupOptionId: "d7f8e714-84ab-4b4c-8c00-389ddbb8238e" },
  { slug: "identidade-visual", label: "Identidade Visual", prazoSugerido: "10 dias úteis", clickupOptionId: "82f7fb26-2a1e-44b3-869b-5516371521ac" },
  { slug: "video", label: "Vídeo", prazoSugerido: "10 dias úteis", clickupOptionId: "87b94f41-9c9b-4653-842c-598507eac6f9" },
  { slug: "produtos", label: "Produtos", prazoSugerido: "10 dias úteis", clickupOptionId: "b6448c82-a3e4-4300-ac4a-a590b6ce7c34" },
  { slug: "telas-apresentacao", label: "Telas de Apresentação", prazoSugerido: "5 dias úteis", clickupOptionId: "8c90c626-3e8e-4d31-9e51-2dee4a24a98f" },
  { slug: "brasao", label: "Brasão", prazoSugerido: "10 dias úteis", clickupOptionId: "4c1fc251-4e79-44c2-91f2-c66eb5f0e395" },
  { slug: "logo", label: "Logo", prazoSugerido: "10 dias úteis", clickupOptionId: "ac6b6852-5a2c-4fd0-a918-13707b97c572" },
  { slug: "mascote", label: "Mascote", prazoSugerido: "10 dias úteis", clickupOptionId: "5df058f4-289d-414d-8231-5d65a2c69325" },
  { slug: "palco-led", label: "Palco & LED", prazoSugerido: "7 dias úteis", clickupOptionId: "81b9393b-1d3c-40dc-8771-0eeaa335126e" },
  { slug: "outros", label: "Outros", prazoSugerido: "7 dias úteis", clickupOptionId: "12141575-9332-4e05-9c68-ae6a5526a469" },
];

export function findTipoSolicitacao(slug: string): TipoSolicitacao | undefined {
  return TIPOS_SOLICITACAO.find((t) => t.slug === slug);
}

// Campos comuns a todos os tipos de solicitação (aparecem em todo formulário
// do ClickUp que a usuária mandou).
export const CLICKUP_FIELD_INSTAGRAM_DA_TURMA = "a2f8473a-017d-4a9d-a47a-1fd17625bf5f";
export const CLICKUP_FIELD_UNIDADE = "2384ad3c-a162-4269-85a6-cfb968a5001f";

export const OPCOES_UNIDADE = [
  { label: "São Paulo", clickupOptionId: "005c746c-6e39-4c6a-843a-bc6f808fea09" },
  { label: "Campinas", clickupOptionId: "f29ce32a-1de6-4cd5-90c7-0765dca18853" },
  { label: "Presidente Prudente", clickupOptionId: "fdd41aec-266f-4fca-b80e-4661f9f1a1b3" },
  { label: "Rio de Janeiro", clickupOptionId: "84da02d4-8149-445c-99ab-c7df5a276d7f" },
] as const;
