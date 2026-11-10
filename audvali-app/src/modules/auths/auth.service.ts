import { AxiosError }from "axios";
import * as SecureStore from "expo-secure-store";

import { api } from "../../api";

interface ILoginResponse {
    mensagem: string;
    token: string;
    senhaExpirada?: boolean;
}

export async function logarColaborador(
    email: string,
    senha: string
): Promise<ILoginResponse> {
    try{
        const { data } = await api.post<ILoginResponse>("/api/colaboradores/logar", { email, senha});

        await SecureStore.setItemAsync(
            "auth_token",
            data.token
        );

        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao logar colaborador.");
        }
        throw new Error("Erro desconhecido ao logar colaborador" + error);
    }
}

export async function logarADM(
    nome: string,
    senha: string,
): Promise<ILoginResponse> {
    try{
        const { data } = await api.post<ILoginResponse>("/api/administradores/login", { nome, senha });

        await SecureStore.setItemAsync(
            "auth_token",
            data.token
        );

        return data
    } catch(error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.mensagem || "Erro ao logar ADM.");
        }
        throw new Error("Erro desconhecido ao logar ADM" + error);
    }
}