import { Request, Response } from "express";
import { criarADM, loginADM, senhaExpirada, trocarSenhaADM } from "./administrador.service";

export async function cadastrarADM(
    req: Request,
    res: Response
) {
    try{
        const { administrador } = req.body;
        await criarADM(administrador);
        return res.status(201).json({
            mensagem: "Administrador cadastrado com sucesso.",
        });
    } catch (error: unknown){
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível realizar o cadastro.",
        })
    }
}

export async function logarADM(
    req: Request,
    res: Response
) {
    try{
        const { nome, senha } = req.body;
        const resultado = await loginADM(nome, senha);
        return res.status(200).json({
            mensagem: "ADM logado com sucesso.",
            token: resultado.token,
            senhaExpirada: senhaExpirada(resultado.administrador.senhaAtualizadaEm),
        });
    } catch(error: unknown){
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível logar ADM.",
        });
    }
}

export async function atualizarSenhaADM(
    req: Request,
    res: Response
) {
    try{
        const { administradorId, sessaoId, senhaAtual, novaSenha } = req.body;
        await trocarSenhaADM( administradorId, sessaoId, senhaAtual, novaSenha);
        return res.status(200).json({
            mensagem: "Senha do ADM alterada com sucesso.",
        });
    } catch(error: unknown){
        return res.status(400).json({
            mensagem: error instanceof Error ? error.message : "Não foi possível alterar senha do ADM.",
        });
    }
}