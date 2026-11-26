import { useState } from "react";
import { IDashboard } from "./dashboard.model";
import { obterDashboard } from "./dashboard.service";

export function useDashboard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDashboard = async (
        inicio?: Date,
        fim?: Date
    ): Promise<IDashboard | null> => {
        if ((inicio && !fim) || (!inicio && fim)) {
            const mensagem = "Para filtrar por período, preencha tanto a data de início quanto a de fim.";
            setError(mensagem);
            return null;
        }
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            const response = await obterDashboard(inicio, fim);
            setSuccess(true);
            return response;
        } catch (error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Verifique os campos preenchidos e tente novamente.";
            setError(mensagemErro);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        handleDashboard,
        loading,
        error,
        success,
    }; 
}