import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { cadastrarColaborador } from "./colaborador.service";
import { validarCadastroColaborador, confirmarSenha } from "./colaborador.validator";
import { Alert } from "react-native";

export function useCadastrarColaborador() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleCadastrarColaborador = async (
        nome: string, 
        email: string, 
        senha: string,
        senhaConfirmada: string
    ): Promise<String | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            validarCadastroColaborador(email, senha, nome);
            confirmarSenha(senha, senhaConfirmada);
            const mensagem = await cadastrarColaborador(nome, email, senha);
            setSuccess(true);
            return mensagem;
        } catch (error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Verifique os campos preenchidos e tente novamente.";
            setError(mensagemErro);
            Alert.alert("Erro", mensagemErro);
            return null;
        } finally{
            setLoading(false);
        }
    };
    return {
        handleCadastrarColaborador,
        loading,
        error,
        success,
    };
}

export function useLogarColaborador() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<String | null>(null);
    const [success, setSuccess] = useState(false);

    const login = useAuthStore((state) => state.login);

    const handleLogarColaborador = async (
        email: string,
        senha: string
    ): Promise<String | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            validarCadastroColaborador(email, senha);
            await login(email.trim().toLowerCase(), senha.trim());
            setSuccess(true);
            return "Login realizado com sucesso.";
        } catch(error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Verifique as credenciais e tente novamente.";
            setError(mensagemErro);
            Alert.alert("Erro", mensagemErro);
            return null;
        } finally{
            setLoading(false);
        }
    };
    return {
        handleLogarColaborador,
        loading,
        error,
        success,
    };
}