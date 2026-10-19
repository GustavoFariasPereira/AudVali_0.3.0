import { Request, Response } from "express";

import { confirmarEmail, criarVerificacao} from "./email.service";

export async function confirmarEmailController(
    req: Request,
    res: Response
) {
    try {
        const { email, codigo } = req.body;

        await confirmarEmail(email, codigo);

        return res.status(200).json({
            mensagem: "E-mail confirmado com sucesso."
        });

    } catch (error: unknown) {
        return res.status(400).json({
             mensagem: error instanceof Error ? error.message : "Não foi possível confirmar o e-mail."
        });
    }
}

export async function reenviarCodigoController(
    req: Request,
    res: Response
) {
    try {
        const { email } = req.body;

        await criarVerificacao(email);

        return res.status(200).json({
            mensagem: "Se o e-mail estiver cadastrado, um código será enviado."
        });

    } catch (error : unknown) {
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível solicitar um novo código."
        });
    }
}