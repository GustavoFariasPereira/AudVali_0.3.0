import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { validarAdministrador } from "../administradores/administrador.validator";
import { validarCadastroColaborador } from "../colaboradores/colaborador.validator";

export function useLogin(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const loginColaborador = useAuthStore((state) => state.login);
    const loginADM = useAuthStore((state) => state.loginAdministrador);

    const handleLogin = async (
        usuario: string, 
        senha: string, 
        isAdministrador: boolean
    ): Promise<{ mensagem: string | null, senhaExpirou: boolean }> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
        if (isAdministrador) {
            validarAdministrador(senha, usuario);
            await loginADM(usuario.trim(), senha.trim());
        } else {
            validarCadastroColaborador(usuario, senha);
            await loginColaborador(usuario.trim().toLowerCase(), senha.trim());
        }
            const { senhaExpirada } = useAuthStore.getState();
            setSuccess(true);
            return { mensagem: "Login realizado com sucesso!", senhaExpirou: senhaExpirada };
        } catch(error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Verifique as credenciais e tente novamente.";
            setError(mensagemErro);
            return { mensagem: null, senhaExpirou: false };
        } finally{
            setLoading(false);
        }
    }; 
    return {
        handleLogin,
        loading,
        error,
        success,
    };
}