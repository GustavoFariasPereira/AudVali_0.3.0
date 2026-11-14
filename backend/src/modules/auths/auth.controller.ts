import { Request, Response } from "express";
import { logout } from "./auth.service";

export async function logoutController(req: Request, res: Response) {
    try {
        await logout(req.sessaoId as string);
        return res.status(200).json({ mensagem: "Logout realizado com sucesso." });
    } catch (error: unknown) {
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível realizar logout.",
        });
    }
}