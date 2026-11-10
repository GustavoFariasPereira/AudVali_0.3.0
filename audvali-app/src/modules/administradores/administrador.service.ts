import { api } from "@/api";
import { validarAdministrador } from "./administrador.validator";
import { AxiosError } from "axios";
import { IUserADM } from "../auths/auth.model";

interface IADMResponse {
    mensagem: string;
};

export async function criarADM(
    nome: string,
    senha: string
) {
    try{
        validarAdministrador(senha, nome);
        const { data } = await api.post<IADMResponse>("/api/administradores/cadastrar", { nome, senha });
        return data.mensagem;
    } catch(error){
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao cadastrar ADM.");
        }
        throw new Error("Erro desconhecido ao cadastrar ADM" + error);
    }
}

export async function alterarSenhaADM(
    senhaAtual: string,
    novaSenha: string
) {
    try{
        if (!senhaAtual) throw new Error("A senha atual é obrigatória.");
        validarAdministrador(novaSenha);
        const { data } = await api.put<IADMResponse>("/api/administradores/alterarSenha", { senhaAtual, novaSenha });
        return data.mensagem;
    } catch(error){
         if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao alterar senha do ADM.");
        }
        throw new Error("Erro desconhecido ao alterar senha do ADM" + error);
    }
}

export async function perfilADM(
    token: string
): Promise<IUserADM> {
    try {
        const { data } = await api.get<IUserADM>("/api/administradores/perfil", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao buscar perfil do administrador.");
        }
        throw new Error("Erro desconhecido ao buscar perfil do administrador" + error);
    }
}