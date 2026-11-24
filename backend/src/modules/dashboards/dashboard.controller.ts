import { Request, Response } from "express";
import { obterDashboard } from "./dashboard.service";

export async function dashboard(req: Request, res: Response) {
    try {
        const { inicio, fim } = req.query;

        let dataInicio: Date | undefined;
        let dataFim: Date | undefined;

        // período é opcional, mas se vier, precisa vir completo e válido
        if (inicio !== undefined || fim !== undefined) {
            if (typeof inicio !== "string" || typeof fim !== "string") {
                return res.status(400).json({ mensagem: "Período inválido." });
            }

            dataInicio = new Date(inicio);
            dataFim = new Date(fim);

            if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).json({ mensagem: "Período inválido." });
            }
        }

        const resultado = await obterDashboard(dataInicio, dataFim);
        return res.status(200).json(resultado);
    } catch (error: unknown) {
        return res.status(500).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível carregar o dashboard.",
        });
    }
}