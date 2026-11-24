// ajuste os caminhos e os nomes dos campos para os seus models
import { Colaborador } from "../colaboradores/colaborador.model";
import { Auditoria } from "../auditorias/auditoria.model";
import { ILogAtividade, LogAtividade } from "../log-atividades/log-atividade.model";

// o que conta como "atividade realizada" (login/logout/trocar_senha ficam de fora)
// Tipando explicitamente o array com base na interface
export const ACOES_DE_ATIVIDADE: Array<ILogAtividade['acao']> = [
    "criar", 
    "atualizar", 
    "deletar", 
    "exportar"
];

export interface IDashboard {
    colaboradoresAtivos: number;
    atividadesRealizadas: number;
    totalAuditorias: number;
}

export async function obterDashboard(inicio?: Date, fim?: Date): Promise<IDashboard> {
    // o log usa "criadoEm"; models com timestamps: true usam "createdAt"
    const periodoLog = inicio && fim ? { criadoEm: { $gte: inicio, $lte: fim } } : {};
    const periodoAuditoria = inicio && fim ? { createdAt: { $gte: inicio, $lte: fim } } : {};

    const [colaboradoresAtivos, atividadesRealizadas, totalAuditorias] = await Promise.all([
        Colaborador.countDocuments({ ativo: true }),
        LogAtividade.countDocuments({
            sucesso: true,
            acao: { $in: ACOES_DE_ATIVIDADE },
            ...periodoLog,
        }),
        Auditoria.countDocuments(periodoAuditoria),
    ]);

    return { colaboradoresAtivos, atividadesRealizadas, totalAuditorias };
}