import { IAuditoria, IAuditoriaResponse } from "./auditoria.model";
import { IProduto } from "../produtos/produto.model";
import { api } from "../../api";
import { AxiosError } from "axios";

interface IResponse{
    mensagem: string;
    auditoria: IAuditoriaResponse;
}
export async function criarAuditoria(auditoria: IAuditoria): Promise<IAuditoriaResponse>{
    try{
        const { data } = await api.post<IResponse>("/api/auditorias/criar", auditoria);
        return data.auditoria;
    } catch (error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.mensagem || "Erro ao criar auditoria.");
        }
        throw new Error("Erro desconhecido ao criar auditoria" + error);
    }
}

export async function atualizarAuditoria(_idAuditoria: string, novosDadosAuditoria: Partial<IAuditoria>, novosDadosProdutos?: Partial<IProduto>[], produtosParaRemover?: string[]): Promise<IAuditoriaResponse>{
    try{
        const { data } = await api.put<IResponse>(`/api/auditorias/atualizar/${_idAuditoria}`, { novosDadosAuditoria, novosDadosProdutos, produtosParaRemover });
        return data.auditoria;
    } catch (error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.mensagem || "Erro ao atualizar auditoria.");
        }
        throw new Error("Erro desconhecido ao atualizar auditoria" + error);
    }
}

export async function deletarAuditoria(_idAuditoria: string): Promise<IAuditoriaResponse>{
    try{
        const { data } = await api.delete<IResponse>(`/api/auditorias/deletar/${_idAuditoria}`);
        return data.auditoria;
    } catch (error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.mensagem || "Erro ao deletar auditoria.");
        }
        throw new Error("Erro desconhecido ao deletar auditoria" + error);
    }
}