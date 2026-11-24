import mongoose, { type QueryFilter } from "mongoose";
import {
    LogAtividade,
    ILogAtividade,
    AcaoLog,
    RecursoLog,
} from "./log-atividade.model";

export interface DadosLog {
    colaboradorId: string;
    sessaoId?: string;
    acao: AcaoLog;
    recurso?: RecursoLog;
    recursoId?: string;
    detalhes?: Record<string, unknown>;
    ip?: string;
    sucesso: boolean;
}

export interface FiltroLogs {
    colaboradorId?: string;
    acao?: AcaoLog;
    recurso?: RecursoLog;
    inicio?: Date;
    fim?: Date;
    pagina: number;
    limite: number;
}

// IPv4 dentro de IPv6 (::ffff:1.2.3.4) -> 1.2.3.4
export function normalizarIp(ip?: string): string | undefined {
    return ip?.replace(/^::ffff:/, "");
}

function paraObjectId(id?: string): mongoose.Types.ObjectId | undefined {
    return id && mongoose.isValidObjectId(id)
        ? new mongoose.Types.ObjectId(id)
        : undefined;
}

/**
 * Grava um registro de atividade. Nunca lança erro: uma falha no log
 * não deve derrubar a operação principal. Se o seu negócio exigir
 * "sem log, sem operação", remova o try/catch.
 *
 * NUNCA coloque senha, hash ou token em "detalhes".
 */
export async function registrarAtividade(dados: DadosLog): Promise<void> {
    try {
        await LogAtividade.create({
            colaboradorId: new mongoose.Types.ObjectId(dados.colaboradorId),
            sessaoId: paraObjectId(dados.sessaoId),
            acao: dados.acao,
            recurso: dados.recurso,
            recursoId: paraObjectId(dados.recursoId),
            detalhes: dados.detalhes,
            ip: normalizarIp(dados.ip),
            sucesso: dados.sucesso,
        });
    } catch (error) {
        console.error("Falha ao registrar atividade:", error);
    }
}

export async function listarLogs(filtro: FiltroLogs) {
    const query: QueryFilter<ILogAtividade> = {};

    if (filtro.colaboradorId) {
        query.colaboradorId = new mongoose.Types.ObjectId(filtro.colaboradorId);
    }
    if (filtro.acao) query.acao = filtro.acao;
    if (filtro.recurso) query.recurso = filtro.recurso;

    if (filtro.inicio || filtro.fim) {
        query.criadoEm = {
            ...(filtro.inicio ? { $gte: filtro.inicio } : {}),
            ...(filtro.fim ? { $lte: filtro.fim } : {}),
        };
    }

    const [itens, total] = await Promise.all([
        LogAtividade.find(query)
            .sort({ criadoEm: -1 })
            .skip((filtro.pagina - 1) * filtro.limite)
            .limit(filtro.limite)
            .populate("colaboradorId", "nome email"),
        LogAtividade.countDocuments(query),
    ]);

    return {
        itens,
        total,
        pagina: filtro.pagina,
        limite: filtro.limite,
        totalPaginas: Math.ceil(total / filtro.limite),
    };
}
