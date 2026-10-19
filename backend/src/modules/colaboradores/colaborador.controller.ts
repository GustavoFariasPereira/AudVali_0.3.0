import { Request, Response } from "express";
import { criarColaborador, loginColaborador, perfilColaborador } from "./colaborador.service";

export async function cadastrarColaborador(
    req: Request,
    res: Response
) {
    try {
        const { nome, email, senha } = req.body;

        await criarColaborador(nome, email, senha);

        return res.status(201).json({
            mensagem: "Se os dados forem válidos, um código de confirmação será enviado para o e-mail informado.",
        });

    } catch (error: unknown) {
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível realizar o cadastro.",
        });
    }
}

export async function logarColaborador(
    req: Request,
    res: Response
) {
    try {
        const { email, senha } = req.body;

        const resultado = await loginColaborador(email, senha);

        return res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token: resultado.token,
        });
    } catch (error: unknown){
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível logar colaborador.",
        });
    }
}

export async function perfil(
    req: Request,
    res: Response
){
    try{
        const resultado = await perfilColaborador(req.colaboradorId!);
        return res.status(200).json(resultado);
    } catch (error: unknown){
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível encontrar o perfil.",
        });
    }
}