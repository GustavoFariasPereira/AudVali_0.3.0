import { Request, Response } from "express";
import { atualizarAuditoria, buscarAuditorias, criarAuditoria, deletarAuditoria } from "./auditoria.service";
import { IAuditoria } from "./auditoria.model";
import { IProduto } from "../produtos/produto.model";

export async function gerarAuditoria(
    req: Request,
    res: Response
) {
    try{
        const auditoria  = req.body;

        const auditoriaCriada = await criarAuditoria(auditoria);

        return res.status(201).json({
            mensagem: "Auditoria criada com sucesso.",
            auditoria: auditoriaCriada,
        });
    } catch (error: unknown) {
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível criar auditoria.",
        });
    }
}

export async function alterarAuditoria(
    req: Request,
    res: Response
) {
    try {
        const { _idAuditoria } = req.params;
        const _idColaborador = req.colaboradorId as string;
        
        const { novosDadosAuditoria, novosDadosProdutos, produtosParaRemover } = req.body as {
            novosDadosAuditoria: Partial<IAuditoria>;
            novosDadosProdutos?: Partial<IProduto>[];
            produtosParaRemover?: string[];
        };

        if (!_idAuditoria || typeof _idAuditoria !== 'string') {
            return res.status(400).json({
                mensagem: "_id da auditoria inválido.",
            });
        }

        const auditoriaAtualizada = await atualizarAuditoria(_idAuditoria, _idColaborador, novosDadosAuditoria, novosDadosProdutos, produtosParaRemover);

        return res.status(200).json({
            mensagem: "Auditoria atualizada com sucesso.",
            auditoria: auditoriaAtualizada,
        });
    } catch (error: unknown) {
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível atualizar auditoria.",
        });
    }
}

export async function listarAuditorias(
    req: Request,
    res: Response
) {
    try {
        const { criadoPor } = req.query as { criadoPor?: string };

        const auditorias = await buscarAuditorias(criadoPor);

        return res.status(200).json({
            mensagem: "Auditorias encontradas com sucesso.",
            auditorias: auditorias,
        });
    } catch (error: unknown) {
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível listar auditorias.",
        });
    }
}

export async function excluirAuditoria(req: Request, res: Response) {
try {
    const { _idAuditoria } = req.params as { _idAuditoria: string };
    const _idColaborador = req.colaboradorId as string;

    const auditoriaExcluida = await deletarAuditoria(_idAuditoria, _idColaborador);

    return res.status(200).json({
      mensagem: "Auditoria excluída com sucesso.",
      auditoria: auditoriaExcluida,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      mensagem: error instanceof Error ? error.message : "Não foi possível excluir a auditoria.",
    });
  }
}