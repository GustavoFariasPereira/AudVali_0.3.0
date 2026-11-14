import { Request, Response, NextFunction } from "express";
import { verificarToken, gerarToken } from "../../utils/jwt";
import { Sessao } from "../../modules/sessoes/sessao.model";
import { Administrador } from "../administradores/administrador.model";
import { senhaExpirada } from "../administradores/administrador.service";
import { meiaNoiteBrasil } from "../../utils/data";

const SEIS_DIAS_EM_SEGUNDOS = 6 * 24 * 60 * 60;

// Inatividade: vale só para colaborador
const INATIVIDADE_MAXIMA_MS = 8 * 24 * 60 * 60 * 1000;

// Limite absoluto desde a criação da sessão (vale para os dois tipos).
// Para desativar, remova o bloco "4" abaixo.
const DURACAO_MAXIMA_SESSAO_MS = 30 * 24 * 60 * 60 * 1000;

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 1. Leitura do header
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Token não informado." });
    }

    const [esquema, token] = authorization.split(" ");

    if (esquema !== "Bearer" || !token) {
        return res.status(401).json({ mensagem: "Token inválido." });
    }

    // 2. Verificação do token: qualquer falha aqui é 401
    let payload: ReturnType<typeof verificarToken>;

    try {
        payload = verificarToken(token);
    } catch {
        return res.status(401).json({ mensagem: "Sessão inválida ou expirada." });
    }

    const tipoUsuario = payload.tipo ?? "colaborador";

    if (tipoUsuario !== "administrador" && tipoUsuario !== "colaborador") {
        return res.status(401).json({ mensagem: "Token inválido." });
    }

    const usuarioId =
        tipoUsuario === "administrador"
            ? payload.administradorId
            : payload.colaboradorId;

    if (!usuarioId || !payload.sessaoId) {
        return res.status(401).json({ mensagem: "Token inválido." });
    }

    // 3. Verificação da sessão: erro aqui é problema interno (500), não de autenticação
    try {
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
            return res.status(401).json({ mensagem: "Sessão inválida ou revogada." });
        }

        const agoraMs = Date.now();

        // 4. Limite absoluto de duração da sessão
        const idadeSessaoMs = agoraMs - new Date(sessao.criadoEm).getTime();

        if (idadeSessaoMs >= DURACAO_MAXIMA_SESSAO_MS) {
            await Sessao.updateOne(
                { _id: sessao._id, revogadaEm: { $exists: false } },
                { $set: { revogadaEm: new Date() } }
            );
            return res.status(401).json({ mensagem: "Sessão expirada." });
        }

        // 5. Inatividade (somente colaborador)
        if (tipoUsuario === "colaborador") {
            const ultimoAcesso = new Date(
                sessao.ultimoAcessoEm ?? sessao.criadoEm
            ).getTime();

            if (agoraMs - ultimoAcesso >= INATIVIDADE_MAXIMA_MS) {
                await Sessao.updateOne(
                    { _id: sessao._id, revogadaEm: { $exists: false } },
                    { $set: { revogadaEm: new Date() } }
                );
                return res.status(401).json({ mensagem: "Sessão expirada por inatividade." });
            }

            // Primeiro acesso do dia: grava no máximo 1 vez por dia
            const inicioDoDia = meiaNoiteBrasil();

            if (ultimoAcesso < inicioDoDia.getTime()) {
                await Sessao.updateOne(
                    {
                        _id: sessao._id,
                        $or: [
                            { ultimoAcessoEm: { $lt: inicioDoDia } },
                            { ultimoAcessoEm: { $exists: false } }
                        ]
                    },
                    { $set: { ultimoAcessoEm: new Date(agoraMs) } }
                );
            }
        }

        // 6. Renovação do token quando passar de 6 dias
        const agora = Math.floor(agoraMs / 1000);
        const emissao = payload.iat ?? agora;
        const idadeToken = agora - emissao;

        if (idadeToken >= SEIS_DIAS_EM_SEGUNDOS) {
            const novoToken = gerarToken({
                tipo: tipoUsuario,
                colaboradorId: payload.colaboradorId,
                administradorId: payload.administradorId,
                sessaoId: payload.sessaoId
            });

            res.setHeader("X-New-Token", novoToken);
            res.setHeader("Access-Control-Expose-Headers", "X-New-Token");
        }

        // 7. Dados para os controllers
        req.tipoUsuario = tipoUsuario;
        req.sessaoId = payload.sessaoId;

        if (tipoUsuario === "administrador") {
            req.administradorId = usuarioId;
        } else {
            req.colaboradorId = usuarioId;
        }

        return next();
    } catch (error) {
        console.error("Erro interno no authMiddleware:", error);
        return res.status(500).json({ mensagem: "Erro interno." });
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