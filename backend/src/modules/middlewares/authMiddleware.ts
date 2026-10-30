import { Request, Response, NextFunction } from "express";
import { verificarToken, gerarToken } from "../../utils/jwt";
import { Sessao } from "../../modules/sessoes/sessao.model";
import { Administrador } from "../administradores/administrador.model";
import { senhaExpirada } from "../administradores/administrador.service";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                mensagem: "Token não informado."
            });
        }

        const [tipo, token] = authorization.split(" ");

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                mensagem: "Token inválido."
            });
        }

        const payload = verificarToken(token);

        const tipoUsuario = payload.tipo ?? "colaborador";

        const usuarioId =
            tipoUsuario === "administrador"
                ? payload.administradorId
                : payload.colaboradorId;

        if (!usuarioId) {
            return res.status(401).json({
                mensagem: "Token inválido."
            });
        }

        const filtroSessao =
            tipoUsuario === "administrador"
                ? {
                    _id: payload.sessaoId,
                    administradorId: usuarioId,
                    revogadaEm: { $exists: false }
                }
                : {
                    _id: payload.sessaoId,
                    colaboradorId: usuarioId,
                    revogadaEm: { $exists: false }
                };

        const sessao = await Sessao.findOne(filtroSessao);

        if (!sessao) {
            return res.status(401).json({
                mensagem: "Sessão inválida ou revogada."
            });
        }

        const agora = Math.floor(Date.now() / 1000);
        const emissao = payload.iat ?? agora;
        const idadeToken = agora - emissao;
        const seisDias = 6 * 24 * 60 * 60;

        if (idadeToken >= seisDias) {
            const novoToken = gerarToken({
                tipo: tipoUsuario,
                colaboradorId: payload.colaboradorId,
                administradorId: payload.administradorId,
                sessaoId: payload.sessaoId
            });

            res.setHeader("X-New-Token", novoToken);
        }

        req.tipoUsuario = tipoUsuario;
        req.sessaoId = payload.sessaoId;

        if (tipoUsuario === "administrador") {
            req.administradorId = usuarioId;
        } else {
            req.colaboradorId = usuarioId;
        }

        next();

    } catch (error) {
        return res.status(401).json({
            mensagem: "Sessão inválida ou expirada."
        });
    }
}

export function apenasAdministrador(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.tipoUsuario !== "administrador") {
        return res.status(403).json({
            mensagem: "Acesso restrito a administradores."
        });
    }

    next();
}

export async function exigirSenhaAtualizada(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.tipoUsuario !== "administrador") return next();

    const admin = await Administrador
        .findById(req.administradorId)
        .select("senhaAlteradaEm");

    if (!admin || senhaExpirada(admin.senhaAtualizadaEm)) {
        return res.status(403).json({
            codigo: "SENHA_EXPIRADA",
            mensagem: "Sua senha expirou. Altere-a para continuar."
        });
    }

    next();
}