import { useState } from "react";
import { confirmarSenha, validarAdministrador } from "./administrador.validator";
import { alterarSenhaADM, criarADM } from "./administrador.service";
import { Alert } from "react-native";
import { useAuthStore } from "@/stores/useAuthStore";

export function useCadastrarADM() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleCadastrarADM = async (
        nome: string,
        senha: string,
        senhaConfirmada: string
    ): Promise<String | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            validarAdministrador(senha, nome);
            confirmarSenha(senha, senhaConfirmada);
            const mensagem = await criarADM(nome, senha);
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
        handleCadastrarADM,
        loading,
        error,
        success,
    };
}

export function useLogarADM() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<String | null>(null);
    const [success, setSuccess] = useState(false);

    const loginADM = useAuthStore((state) => state.loginAdministrador);

    const handleLogarADM = async (
        nome: string,
        senha: string
    ): Promise<String | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            validarAdministrador(senha, nome);
            await loginADM(nome, senha);
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
        handleLogarADM,
        loading,
        error,
        success,
    };
}

export function useAlterarSenhaADM() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleAlterarSenhaADM = async (
        senhaAtual: string,
        novaSenha: string,
        confirmarNovaSenha: string
    ): Promise<String | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            if (!senhaAtual) throw new Error("A senha atual é obrigatória.");
            validarAdministrador(novaSenha);
            confirmarSenha(novaSenha, confirmarNovaSenha);
            const mensagem = await alterarSenhaADM(senhaAtual, novaSenha);
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
        handleAlterarSenhaADM,
        loading,
        error,
        success,
    };
}