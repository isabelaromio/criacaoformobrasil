import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não configurada. Confira o .env.local (veja .env.local.example).`
    );
  }
  return value;
}

export const env = {
  get CLICKUP_API_TOKEN() {
    return required("CLICKUP_API_TOKEN");
  },
  get CLICKUP_LIST_ID() {
    return required("CLICKUP_LIST_ID");
  },
  get CLICKUP_FIELD_TIPO_SOLICITACAO() {
    return required("CLICKUP_FIELD_TIPO_SOLICITACAO");
  },
  get CLICKUP_FIELD_NOME_TURMA() {
    return required("CLICKUP_FIELD_NOME_TURMA");
  },
  get CLICKUP_STATUS_INICIAL() {
    return process.env.CLICKUP_STATUS_INICIAL || "briefings";
  },
};
