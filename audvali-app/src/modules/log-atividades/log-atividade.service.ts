import { api } from "@/api";
import { IFiltroLogs, ILogAtividade, ILogResponse } from "./log-atividade.model";



export async function logAtividade(filtro: IFiltroLogs): Promise<ILogResponse>{
    try{
        const { data } = await api.get<ILogResponse>("log-atividades/logs", { params: filtro });
        return data;
    } catch (error: any) {
        const mensagemErro = error.response?.data?.mensagem || "Erro ao obter logs.";
        
        console.error("Erro ao obter logs:", mensagemErro);
        
        throw new Error(mensagemErro);
    }
}