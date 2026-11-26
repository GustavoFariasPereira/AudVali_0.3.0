import { api } from "@/api";
import { IDashboard } from "./dashboard.model";

export async function obterDashboard(inicio?: Date, fim?: Date): Promise<IDashboard>{
    try {
        const { data } = await api.get<IDashboard>("/dashboards/painel", {
            params: { inicio, fim }
        });
        return data;
    } catch (error: any) {
        // Extrai a mensagem de erro que veio do back-end, se houver
        const mensagemErro = error.response?.data?.mensagem || "Erro ao obter dashboard.";
        
        console.error("Erro ao obter dashboard:", mensagemErro);
        
       // Lança um novo erro contendo a mensagem tratada para o componente capturar
        throw new Error(mensagemErro);
    }
} 