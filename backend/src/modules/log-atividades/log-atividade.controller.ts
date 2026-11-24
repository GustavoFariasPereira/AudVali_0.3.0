import { Request, Response } from "express";
import mongoose from "mongoose";
import { ACOES_LOG, RECURSOS_LOG, AcaoLog, RecursoLog } from "./log-atividade.model";
import { listarLogs } from "./log-atividade.service";

// aceita só string não vazia (barra objetos e arrays vindos da query)
function texto(valor: unknown): string | undefined {
    return typeof valor === "string" && valor.trim() ? valor.trim() : undefined;
}

function data(valor: string | undefined): Date | undefined | "invalida" {
    if (!valor) return undefined;
    const d = new Date(valor);
    return isNaN(d.getTime()) ? "invalida" : d;
}

export async function listar(req: Request, res: Response) {
    try {
        const colaboradorId = texto(req.query.colaboradorId);
        const acao = texto(req.query.acao);
        const recurso = texto(req.query.recurso);

        if (colaboradorId && !mongoose.isValidObjectId(colaboradorId)) {
            return res.status(400).json({ mensagem: "colaboradorId inválido." });
        }
        if (acao && !(ACOES_LOG as readonly string[]).includes(acao)) {
            return res.status(400).json({ mensagem: "Ação inválida." });
        }
        if (recurso && !(RECURSOS_LOG as readonly string[]).includes(recurso)) {
            return res.status(400).json({ mensagem: "Recurso inválido." });
        }

        const inicio = data(texto(req.query.inicio));
        const fim = data(texto(req.query.fim));

        if (inicio === "invalida" || fim === "invalida") {
            return res.status(400).json({ mensagem: "Período inválido." });
        }

        const pagina = Math.max(1, parseInt(texto(req.query.pagina) ?? "1", 10) || 1);
        const limite = Math.min(100, Math.max(1, parseInt(texto(req.query.limite) ?? "20", 10) || 20));

        const resultado = await listarLogs({
            colaboradorId,
            acao: acao as AcaoLog | undefined,
            recurso: recurso as RecursoLog | undefined,
            inicio,
            fim,
            pagina,
            limite,
        });

        return res.status(200).json(resultado);
    } catch (error: unknown) {
        return res.status(500).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível listar os logs.",
        });
    }
}