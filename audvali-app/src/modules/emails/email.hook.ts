import { useState } from "react";
import { confirmarEmail, reenviarCodigo } from "./email.service";
import { Alert } from "react-native";

export function useConfirmarEmail () {
    const [loading, setLoading ] = useState(false);
    const [error, setError ] = useState<string | null>(null);
    const [success, setSuccess ] = useState(false); 

    const handleConfirmarEmail = async (
        email: string,
        codigo: string
    ): Promise<String | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            const mensagem = await confirmarEmail(email, codigo);
            setSuccess(true);
            return mensagem;
        } catch (error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Erro na confirmação do E-mail.";
            setError(mensagemErro);
            Alert.alert("Erro", mensagemErro);
            return null;
        } finally{
            setLoading(false)
        }
    };
    return {
        handleConfirmarEmail,
        loading,
        error,
        success,
    };
}

export function useReenviarCodigo() {
    const [loading, setLoadin] = useState(false);
    const [error, setError] = useState<String | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReenviarCodigo = async (
        email: string
    ): Promise<String | null> => {
        setLoadin(true);
        setError(null);
        setSuccess(false);
        try{
            const mensagem = await reenviarCodigo(email);
            setSuccess(true);
            return mensagem;
        } catch (error: unknown){
            const mensagemErro = error instanceof Error ? error.message : "Erro ao reenviar código.";
            setError(mensagemErro);
            Alert.alert("Erro", mensagemErro);
            return null;
        } finally{
            setLoadin(false);
        }

    };
    return{
        handleReenviarCodigo,
        loading,
        error,
        success,
    };
}