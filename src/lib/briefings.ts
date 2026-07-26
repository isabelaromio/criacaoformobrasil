// Campos específicos de cada "Tipo de Solicitação", espelhando os formulários
// que a equipe já usa hoje no ClickUp (colados pela usuária). Os campos comuns
// a todo tipo (Nome da Turma, Instagram da Turma, Unidade, Prazo, Anexos) são
// tratados fora daqui, em SolicitacaoForm.tsx e na rota da API.
//
// "Telas de Apresentação" e "Palco & LED" ainda não têm modelo confirmado —
// por ora caem no fallback genérico (campo de briefing livre).

export type CampoTexto = {
  tipo: "texto";
  chave: string;
  label: string;
  placeholder?: string;
  clickupFieldId: string;
  obrigatorio?: boolean;
};

export type CampoTextarea = {
  tipo: "textarea";
  chave: string;
  label: string;
  placeholder?: string;
  clickupFieldId: string;
  obrigatorio?: boolean;
};

export type CampoSelect = {
  tipo: "select";
  chave: string;
  label: string;
  clickupFieldId: string;
  // Como o valor deve ser enviado ao ClickUp: "drop_down" manda o id direto,
  // "labels" manda um array de ids (mesmo escolhendo só uma opção).
  formatoClickup: "drop_down" | "labels";
  maximoEscolhas?: number; // >1 habilita seleção múltipla (checkboxes)
  opcoes: { label: string; clickupOptionId: string }[];
  obrigatorio?: boolean;
};

export type CampoEspecifico = CampoTexto | CampoTextarea | CampoSelect;

export type BriefingTipo = {
  camposEspecificos: CampoEspecifico[];
  orientacoes?: string;
};

export const BRIEFINGS_POR_TIPO: Partial<Record<string, BriefingTipo>> = {
  "posts-instagram": {
    camposEspecificos: [
      {
        tipo: "select",
        chave: "tamanhoArte",
        label: "Tamanho da arte",
        clickupFieldId: "e3c7b189-61f9-49f3-87de-6a39d07b5e87",
        formatoClickup: "labels",
        opcoes: [
          { label: "Feed - 1080x1350", clickupOptionId: "eb2d8e9b-eeca-491c-aca7-4d5288c01d31" },
          { label: "Story - 1080x1920", clickupOptionId: "0affb290-3b31-43a1-a03a-ed789385645b" },
          { label: "Feed e Story", clickupOptionId: "6502faea-520b-4cf7-9aac-10376d6fd7f5" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "textarea",
        chave: "post",
        label: "Post",
        placeholder: "CAPA: ...\n\nPOST 01\nTÍTULO:\nSUBTÍTULO:\nTEXTO:",
        clickupFieldId: "8eec7387-d3ac-40e5-b62f-b038c3f7cb48",
        obrigatorio: true,
      },
    ],
    orientacoes: `Como preencher a descrição do post:

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

Para posts carrossel, use TELA 01, TELA 02, TELA 03... no lugar de POST.`,
  },

  produtos: {
    camposEspecificos: [
      {
        tipo: "select",
        chave: "mockupGabarito",
        label: "Mockup e Gabarito",
        clickupFieldId: "b10e83fc-1c52-4515-b81f-6e5aba49d0e8",
        formatoClickup: "drop_down",
        opcoes: [
          { label: "Somente Mockup", clickupOptionId: "677f5428-dfe2-4eac-9e99-1cb8f7b9b24c" },
          { label: "Somente Gabarito", clickupOptionId: "53fb7b1b-9ec9-495f-95be-d9a2c63e27ee" },
          { label: "Mockup e Gabarito", clickupOptionId: "408eb548-54e7-4453-8416-a9a5674b479d" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "textarea",
        chave: "descricaoProdutos",
        label: "Descrição dos produtos",
        placeholder: "TIPO DE PRODUTO: camiseta, chinelo, óculos, copo, caneca, tirante...\nMEDIDAS DA ARTE:\nESPECIFICAÇÕES: cores, escritas, elementos...",
        clickupFieldId: "5e368480-b364-428f-9a44-25d25bd672bc",
        obrigatorio: true,
      },
    ],
    orientacoes: `Como preencher a descrição:

TIPO DE PRODUTO: camiseta, chinelo, óculos, copo, caneca, tirante...
MEDIDAS DA ARTE:
ESPECIFICAÇÕES: cores, escritas, elementos...

Limite de produtos por card: 03

Mockups e Gabaritos:
Alguns produtos não precisam de mockup — fazemos direto o gabarito (arte final), como backdrop e cardápio.
Alguns produtos que não serão confeccionados agora, fazemos apenas mockups, como caixa personalizada e produtos de "vitrine" do comercial.
Produtos feitos apenas com mockup podem ter o gabarito solicitado depois da aprovação do mockup pela turma.`,
  },

  video: {
    camposEspecificos: [
      {
        tipo: "texto",
        chave: "presskitArtista",
        label: "Presskit artista",
        placeholder: "Adicionar link ou documento no item Anexos",
        clickupFieldId: "48a61e6c-e920-4fa6-ac15-6c7958158178",
      },
      {
        tipo: "textarea",
        chave: "descricaoTarefa",
        label: "Descrição da tarefa",
        placeholder: "FORMATO:\nDURAÇÃO:\nMÚSICA OU ESTILO MUSICAL:\nTEXTOS DO VÍDEO:\nTAKE 01:\nTAKE 02:\nTAKE 03:",
        clickupFieldId: "84b3e23e-c372-48c8-ad8b-13a1c9c4c6c0",
        obrigatorio: true,
      },
      {
        tipo: "textarea",
        chave: "capaVideo",
        label: "Capa do vídeo",
        placeholder: "COR DA CAPA:\nTEXTO:",
        clickupFieldId: "bc91bcbb-77a2-41b3-872d-6d641fc60fe4",
      },
    ],
    orientacoes: `Preencha a descrição da tarefa com:

FORMATO:
DURAÇÃO:
MÚSICA OU ESTILO MUSICAL:
TEXTOS DO VÍDEO:
TAKE 01: ...
TAKE 02: ...
TAKE 03: ...

Capa do vídeo:
COR DA CAPA:
TEXTO:`,
  },

  brasao: {
    camposEspecificos: [
      {
        tipo: "texto",
        chave: "textoNoBrasao",
        label: "O que deve estar escrito no Brasão",
        placeholder: "Faculdade e Curso | ex: Medicina Unip",
        clickupFieldId: "c407c883-2ca3-4ea3-84f9-fac6d43caa92",
      },
      {
        tipo: "texto",
        chave: "ano",
        label: "Ano (início e término do curso)",
        placeholder: "ex: 2021-2024",
        clickupFieldId: "e5745270-e8b6-4768-8911-3f14bb276553",
      },
      {
        tipo: "texto",
        chave: "cores",
        label: "Cores",
        placeholder: "Não esqueça de mencionar se terá elementos prata ou dourado",
        clickupFieldId: "3bf9a3f0-5bce-4274-ae90-8801ffac2f1b",
      },
      {
        tipo: "select",
        chave: "metalico",
        label: "Metálico",
        clickupFieldId: "0c21ca24-1d81-45ab-a455-b71956210297",
        formatoClickup: "drop_down",
        opcoes: [
          { label: "Prata", clickupOptionId: "27fc39d0-2a9e-44fa-8ad4-7d10241e99aa" },
          { label: "Dourado", clickupOptionId: "05aec18b-6b0d-4629-ae8d-8b34dba39c17" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "textarea",
        chave: "observacoesExtras",
        label: "Observações extras",
        placeholder: "Elementos que devem conter no brasão e outras observações importantes",
        clickupFieldId: "d303acb8-2526-4e45-b87c-b6970ebeadf1",
      },
    ],
    orientacoes: `IMPORTANTE: trabalhamos em cima de moldes pré-prontos de brasão, o que limita um pouco variações e detalhes. Alinhe sempre com a turma antes de oferecer esse diferencial.`,
  },

  logo: {
    camposEspecificos: [
      {
        tipo: "texto",
        chave: "textoNoLogo",
        label: "O que deve estar escrito no Logo",
        clickupFieldId: "c407c883-2ca3-4ea3-84f9-fac6d43caa92",
      },
      {
        tipo: "texto",
        chave: "ano",
        label: "Ano (início e término do curso)",
        placeholder: "Sinalize se essa informação é indispensável ou opcional no Logo",
        clickupFieldId: "e5745270-e8b6-4768-8911-3f14bb276553",
      },
      {
        tipo: "texto",
        chave: "cores",
        label: "Cores",
        clickupFieldId: "3bf9a3f0-5bce-4274-ae90-8801ffac2f1b",
      },
      {
        tipo: "texto",
        chave: "fonte",
        label: "Fonte",
        clickupFieldId: "ef63510f-7cfd-4cd4-a9d7-a292fd7c27b8",
      },
      {
        tipo: "textarea",
        chave: "caracteristicasIdeia",
        label: "Características e descrição da ideia",
        placeholder: "Nos conte suas ideias",
        clickupFieldId: "928aba0c-b3eb-4418-ba4a-d33bfa88611b",
      },
    ],
    orientacoes: `Logos que dependerem de mascote para serem feitos serão agendados apenas após a entrega do mascote, contando o prazo a partir daí.`,
  },

  mascote: {
    camposEspecificos: [
      {
        tipo: "texto",
        chave: "personagem",
        label: "Personagem",
        placeholder: "Coelho, Raposa, Tigre, Deusa...",
        clickupFieldId: "3bd025d0-c9b5-49da-b163-bae9d245108f",
      },
      {
        tipo: "texto",
        chave: "cores",
        label: "Cores",
        placeholder: "Quais cores principais devem ser usadas?",
        clickupFieldId: "3bf9a3f0-5bce-4274-ae90-8801ffac2f1b",
      },
      {
        tipo: "textarea",
        chave: "caracteristicas",
        label: "Características",
        placeholder: "Deverá ser bravo ou cara de simpático? Gordo, magro, forte? Tatuado, cabeçudo etc...",
        clickupFieldId: "769afdcb-632e-43f3-a76f-1136b976e47c",
      },
      {
        tipo: "texto",
        chave: "posicao",
        label: "Posição",
        placeholder: "Visto de frente, visto à 45º | Corpo todo, cintura pra cima, apenas rosto...",
        clickupFieldId: "53238b70-1d25-49bb-a390-308849eec8ca",
      },
      {
        tipo: "texto",
        chave: "objetos",
        label: "Objetos",
        placeholder: "Especifique objetos e onde ele deve estar (mão direita, mão esquerda, cabeça...)",
        clickupFieldId: "2da8f350-f61f-44ca-9857-9dcb3f980404",
      },
      {
        tipo: "textarea",
        chave: "descricaoGeral",
        label: "Descrição geral da ideia",
        clickupFieldId: "48620e3e-3a66-42bc-b9a2-e7e5e31f309f",
      },
    ],
    orientacoes: `Não serão solicitados mascotes sem imagens de referência (anexe pelo menos uma abaixo).
O prazo de entrega pode variar de acordo com a disponibilidade do freelancer.
A criação disponibiliza apenas um mascote por comissão — mascotes extras ficam sob responsabilidade da turma.`,
  },

  "identidade-visual": {
    camposEspecificos: [
      {
        tipo: "texto",
        chave: "dataReuniao",
        label: "Data da reunião",
        clickupFieldId: "8524e910-cd70-4c17-bb98-62dac1c08006",
      },
      {
        tipo: "select",
        chave: "estiloDesign",
        label: "Estilo de design (escolha até duas opções)",
        clickupFieldId: "896e88b7-fbd3-47e1-99ee-fa958e9b894d",
        formatoClickup: "labels",
        maximoEscolhas: 2,
        opcoes: [
          { label: "Elegante", clickupOptionId: "6dcf69cb-4d68-4b3b-8b3b-14fec98473da" },
          { label: "Clássico", clickupOptionId: "35d5ec39-40a2-44fe-9f47-026b588bd38d" },
          { label: "Alternativo", clickupOptionId: "fe9cdfbe-4e58-4e93-b8b7-4ee34266e47d" },
          { label: "Moderno", clickupOptionId: "9369a8b7-ad88-41ab-a8c7-8da99baaebc4" },
          { label: "Flat", clickupOptionId: "2136a3fc-4f6b-452e-84fa-4160482476f2" },
          { label: "Outro", clickupOptionId: "3e115f98-2a33-476f-b0d2-3bf4544d39ee" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "texto",
        chave: "estiloDesignOutros",
        label: "Se escolheu \"Outro\" acima, cite o estilo específico",
        clickupFieldId: "1ad3367f-4ed3-4d77-b343-c72cf2f54cd0",
      },
      {
        tipo: "textarea",
        chave: "texturaElementos",
        label: "Textura, elementos",
        placeholder: "Flat, Granulado, Glitter, Metálico, Ornamentos, Galáxia, Folhagens...",
        clickupFieldId: "6e662358-0086-4831-8d15-bab29411bbac",
      },
      {
        tipo: "textarea",
        chave: "conceitoIdeia",
        label: "Conceito da ideia",
        placeholder: "Nos conte o que já pensou até aqui, queremos ouvir suas ideias",
        clickupFieldId: "679c3db7-d851-465c-9e53-844034ee036d",
      },
      {
        tipo: "texto",
        chave: "coresIndispensaveis",
        label: "Qual ou quais cores não podem faltar no seu projeto?",
        clickupFieldId: "86a44658-aeb6-4731-b4bb-03ae4181cd86",
      },
      {
        tipo: "texto",
        chave: "corProibida",
        label: "Existe alguma cor proibida na sua identidade visual?",
        clickupFieldId: "ebaedb41-78f5-4f80-9d93-4d96523355b4",
      },
      {
        tipo: "select",
        chave: "paletaPreferida",
        label: "Selecione uma opção que mais te agrada",
        clickupFieldId: "c4d1d6ba-897b-4ff7-9918-2d585eacdcd7",
        formatoClickup: "labels",
        opcoes: [
          { label: "Cores Neutras e Claras", clickupOptionId: "ee206bfc-5733-4c10-a3ea-fab7b247a147" },
          { label: "Cores Neutras e Escuras", clickupOptionId: "8bee72ef-56e9-4c58-b24a-cc4cf84d20e2" },
          { label: "Cores Vibrantes e Claras", clickupOptionId: "4dfdbe98-f4ec-4121-b74f-32656009b9db" },
          { label: "Cores Vibrantes e Escuras", clickupOptionId: "9bfffc36-eb09-46f5-a780-1a38d2f964c0" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "select",
        chave: "tomMetalico",
        label: "Gostaria de tons metálicos na sua identidade?",
        clickupFieldId: "fc409711-3598-4f42-ba64-221160b20f96",
        formatoClickup: "drop_down",
        opcoes: [
          { label: "Prata", clickupOptionId: "001fc9b9-56f7-4cca-8581-166936cf1750" },
          { label: "Dourado", clickupOptionId: "d8d56a9b-9811-4d1c-b4d3-b67ba56a51d7" },
          { label: "Cobre", clickupOptionId: "f4f05549-0665-4ff2-ac86-978e819c6530" },
          { label: "Não gostaria", clickupOptionId: "1bac6844-ec57-4a13-9a9e-b54139f2fa62" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "select",
        chave: "fontePrincipal",
        label: "Fonte principal",
        clickupFieldId: "8b09e259-ae5b-427e-b7ab-2235869b25b0",
        formatoClickup: "drop_down",
        opcoes: [
          { label: "Elegante", clickupOptionId: "76ffdf3c-5f1c-4ca1-80e9-61f99b01cfe5" },
          { label: "Clássica", clickupOptionId: "1d267816-41ca-4937-90d6-b66c972b15a5" },
          { label: "Moderna", clickupOptionId: "cb937553-67e2-4e8c-a57e-4341470134d4" },
          { label: "Alternativo", clickupOptionId: "8ccb1f94-a464-4798-99ca-32bfd5e843f6" },
          { label: "Futurista", clickupOptionId: "13991741-4748-41f0-9dd7-1682feaa3a8a" },
          { label: "Festival", clickupOptionId: "2fb1af69-c29d-4ade-a3d2-f71bb9dc0170" },
          { label: "Manuscrito", clickupOptionId: "8a9e277b-6c21-4689-adde-470e85606ba1" },
        ],
        obrigatorio: true,
      },
      {
        tipo: "texto",
        chave: "fontePrincipalOutros",
        label: "Outra fonte específica que gostaria (se houver)",
        clickupFieldId: "b7acd4e1-29fb-4933-b759-6ec28ecd8966",
      },
      {
        tipo: "texto",
        chave: "estiloTipograficoIndesejado",
        label: "Existe algum estilo tipográfico que você NÃO queira?",
        clickupFieldId: "b793b740-805d-46e1-a276-6010bc39c3fc",
      },
      {
        tipo: "textarea",
        chave: "acrescentarAlgo",
        label: "Depois de tudo, teria algo mais a acrescentar?",
        placeholder: "Sentiu que faltou algo? Pode abrir o coração",
        clickupFieldId: "1763045a-8574-49dd-a080-a2cf287935bc",
      },
      {
        tipo: "textarea",
        chave: "primeiraTrinca",
        label: "Conteúdo primeira trinca de posts",
        placeholder: "De preferência para apresentação da parceria da comissão com a Formô",
        clickupFieldId: "52b68005-4dfa-445d-b251-8d2092bd1f8f",
      },
      {
        tipo: "textarea",
        chave: "segundaTrinca",
        label: "Conteúdo segunda trinca de posts",
        clickupFieldId: "b2f120e1-e6d7-4270-8cd0-0cd984f7724f",
      },
    ],
    orientacoes: `A fonte secundária será definida pela equipe na hora da criação, de acordo com os princípios básicos de design, pra deixar os materiais harmônicos.

Envie nos Anexos, se puder, referências de feed, imagens, texturas ou tipografias que remetam ao conceito desejado — podem (e devem) ser referências fora do universo de formaturas.`,
  },
};
