export const ACOES_LOG = [
    "login",
    "logout",
    "criar",
    "atualizar",
    "deletar",
    "exportar",
    "trocar_senha",
] as const;

export type AcaoLog = (typeof ACOES_LOG)[number];

export const RECURSOS_LOG = ["colaborador", "auditoria"] as const;

export type RecursoLog = (typeof RECURSOS_LOG)[number];

export interface ILogAtividade extends Document {
    colaboradorId: string;
    sessaoId?: string;
    acao: AcaoLog;
    recurso?: RecursoLog;
    recursoId?: string;
    detalhes?: Record<string, unknown>;
    ip?: string;
    sucesso: boolean;
    criadoEm: Date;
}

export interface IFiltroLogs {
    colaboradorId?: string;
    acao?: AcaoLog;
    recurso?: RecursoLog;
    inicio?: Date;
    fim?: Date;
    pagina: number;
    limite: number;
}

export interface ILogResponse {
    itens: ILogAtividade[];
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
}