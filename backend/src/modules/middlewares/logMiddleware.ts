import { Request, Response, NextFunction } from "express";
import { AcaoLog, RecursoLog } from "../log-atividades/log-atividade.model";
import { registrarAtividade } from "../log-atividades/log-atividade.service";
import { obterIpReal } from "../../utils/ip";

/**
 * Registra a atividade DEPOIS que a resposta é enviada (não atrasa a requisição).
 * Deve vir depois do authMiddleware, que preenche req.colaboradorId e req.sessaoId.
 *
 * O controller pode enriquecer o registro:
 *   res.locals.recursoId   = nova._id;                    // útil em "criar"
 *   res.locals.detalhesLog = { camposAlterados: [...] };  // contexto extra
 */
export function registrarLog(acao: AcaoLog, recurso?: RecursoLog) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.on("finish", () => {
            // este log é só de colaboradores
            if (!req.colaboradorId) return;

            const recursoId = res.locals.recursoId ?? req.params.id;

            void registrarAtividade({
                colaboradorId: req.colaboradorId,
                sessaoId: req.sessaoId,
                acao,
                recurso,
                recursoId: recursoId ? String(recursoId) : undefined,
                detalhes: res.locals.detalhesLog,
                ip: obterIpReal(req),
                sucesso: res.statusCode < 400,
            });
        });

        next();
    };
}