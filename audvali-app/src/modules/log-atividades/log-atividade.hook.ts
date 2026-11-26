import { useState } from "react";
import { IFiltroLogs, ILogResponse } from "./log-atividade.model";
import { logAtividade } from "./log-atividade.service";

export function useLogAtividade(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const handleLogAtividade = async (
        filtro: IFiltroLogs
    ): Promise<ILogResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            const response = await logAtividade(filtro);
            setSuccess(true);
            return response;
        } catch(error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Verifique os campos preenchidos e tente novamente.";
            setError(mensagemErro);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        handleLogAtividade,
        loading,
        error,
        success,
    }; 
}