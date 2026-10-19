import { AxiosError } from "axios";
import { api } from "../../api";

interface IEmailResponse {
    mensagem: string;
};

export async function confirmarEmail(email: string, codigo: string): Promise<string> {
    try{
        const { data } = await api.post<IEmailResponse>("/api/emails/confirmar-email", {
            email,
            codigo
        });
        return data.mensagem;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao confirmar email");
        }
        throw new Error("Erro inesperado: " + error);
    }
}

export async function reenviarCodigo(email: string): Promise<string> {
    try{
        const { data } = await api.post<IEmailResponse>("/api/emails/reenviar-codigo", {
            email
        });
        return data.mensagem;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.mensagem || "Erro ao reenviar código");
        }
        throw new Error("Erro inesperado: " + error);   
    }
}