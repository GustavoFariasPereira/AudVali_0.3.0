import { AxiosError } from "axios";
import { api } from "../../api";
import { IUser } from "../auths/auth.model";

interface IColaboradorResponse {
    mensagem: string;
};

export async function cadastrarColaborador(nome: string, email: string, senha: string): Promise<string> {
    try {
        const { data } = await api.post<IColaboradorResponse>("/api/colaboradores/cadastrar", { nome, email, senha });
        return data.mensagem;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao cadastrar colaborador.");
        }
        throw new Error("Erro desconhecido ao cadastrar colaborador" + error);
    }
}

export async function logarColaborador(email: string, senha: string): Promise<string> {
    try {
        const { data } = await api.post<IColaboradorResponse>("/api/colaboradores/logar", { email, senha });
        return data.mensagem;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao logar colaborador.");
        }
        throw new Error("Erro desconhecido ao logar colaborador" + error);
    }
}

export async function perfilColaborador(
    token: string
): Promise<IUser> {
    try {
        const { data } = await api.get<IUser>("/api/colaboradores/perfil", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao buscar perfil do colaborador.");
        }
        throw new Error("Erro desconhecido ao buscar perfil do colaborador" + error);
    }
}