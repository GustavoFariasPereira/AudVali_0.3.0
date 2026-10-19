import { AxiosError }from "axios";
import * as SecureStore from "expo-secure-store";

import { api } from "../../api";

interface LoginResponse {
    mensagem: string;
    token: string;
}

export async function logarColaborador(
    email: string,
    senha: string
): Promise<LoginResponse> {
    try{
        const { data } = await api.post<LoginResponse>("/api/colaboradores/logar", { email, senha});

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