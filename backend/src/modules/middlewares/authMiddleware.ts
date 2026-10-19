import { Request, Response, NextFunction } from "express";
import { verificarToken, gerarToken } from "../../utils/jwt";
import { Sessao } from "../../modules/sessoes/sessao.model";

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

        const sessao = await Sessao.findOne({
            _id: payload.sessaoId,
            colaboradorId: payload.colaboradorId,
            revogadaEm: { $exists: false }
        });

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
                colaboradorId: payload.colaboradorId,
                sessaoId: payload.sessaoId
            });

            res.setHeader("X-New-Token", novoToken);
        }

        req.colaboradorId = payload.colaboradorId;
        req.sessaoId = payload.sessaoId;

        next();

    } catch (error) {
        return res.status(401).json({
            mensagem: "Sessão inválida ou expirada."
        });
    }
}