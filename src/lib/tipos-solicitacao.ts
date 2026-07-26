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

// Campos específicos do tipo "Posts Instagram", espelhando o briefing que a
// equipe já usa hoje dentro do ClickUp. Os outros 9 tipos ainda usam o campo
// de briefing livre genérico, até termos o modelo de cada um confirmado.
export const TAMANHOS_ARTE_POSTS_INSTAGRAM = [
  { label: "Feed - 1080x1350", clickupOptionId: "eb2d8e9b-eeca-491c-aca7-4d5288c01d31" },
  { label: "Story - 1080x1920", clickupOptionId: "0affb290-3b31-43a1-a03a-ed789385645b" },
  { label: "Feed e Story", clickupOptionId: "6502faea-520b-4cf7-9aac-10376d6fd7f5" },
] as const;

export const CAMPOS_CLICKUP_POSTS_INSTAGRAM = {
  instagramDaTurma: "a2f8473a-017d-4a9d-a47a-1fd17625bf5f",
  tamanhoDaArte: "e3c7b189-61f9-49f3-87de-6a39d07b5e87",
  post: "8eec7387-d3ac-40e5-b62f-b038c3f7cb48",
} as const;

export const ORIENTACOES_POST_INSTAGRAM = `Como preencher a descrição do post:

POST 01
TÍTULO:
SUBTÍTULO:
TEXTO:

POST 02
TÍTULO:
SUBTÍTULO:
TEXTO:

Se achar necessário, acrescente:
COR DO POST:
ELEMENTOS VISUAIS:
REFERÊNCIAS: (adicione o link ou a imagem nos anexos)

Para posts carrossel, use TELA 01, TELA 02, TELA 03... no lugar de POST.`;
