import { useState } from "react";
import { IAuditoria, IAuditoriaResponse } from "./auditoria.model";
import { atualizarAuditoria, criarAuditoria, deletarAuditoria } from "./auditoria.service";
import { validarAuditoria } from "./auditoria.validator";
import { validarProduto } from "../produtos/produto.validator";
import { Alert } from "react-native";
import { IProduto } from "../produtos/produto.model";

export function useCriarAuditoria() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleCriarAuditoria = async (
        auditoria: IAuditoria
    ): Promise<IAuditoriaResponse | null> =>{
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            validarAuditoria(auditoria.nome, auditoria.criadoPor, auditoria.produtos);
            for (const produto of auditoria.produtos){
                validarProduto(produto.codigo, produto.nome, produto.validade.toString(), produto.quantidade);
            }
            const auditoriaCriada = await criarAuditoria(auditoria);
            setSuccess(true);
            return auditoriaCriada;
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
        handleCriarAuditoria,
        loading,
        error,
        success,
    };
}

export function useAtualizarAuditoria() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<String | null>(null);
    const [success, setSuccess] = useState(false);

    const handleAtualizarAuditoria = async (
        _idAuditoria: string,
        novosDadosAuditoria: Partial<IAuditoria>,
        novosDadosProdutos?: Partial<IProduto>[],
        produtosParaRemover?: string[]
    ): Promise<IAuditoriaResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            validarAuditoria(novosDadosAuditoria.nome, novosDadosAuditoria.criadoPor);
            for (const produto of novosDadosProdutos|| []) {
                validarProduto(produto.codigo, produto.nome, produto.validade?.toString(), produto.quantidade);
            }
            const auditoriaAtualizada = await atualizarAuditoria(_idAuditoria, novosDadosAuditoria, novosDadosProdutos, produtosParaRemover);
            setSuccess(true);
            return auditoriaAtualizada;
        } catch (error: unknown) {
            const mensagemErro = error instanceof Error ? error.message : "Verifique os campos preenchidos e tente novamente.";
            setError(mensagemErro);
            Alert.alert("Erro", mensagemErro);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        handleAtualizarAuditoria,
        loading,
        error,
        success,
    };
}

export function useDeletarAuditoria() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<String | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDeletarAuditoria = async (_idAuditoria: string): Promise<IAuditoriaResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const auditoriaExcluida = await deletarAuditoria(_idAuditoria);
            setSuccess(true);
            return auditoriaExcluida;
        } catch (error: unknown) {
            const mensagemErro = error instanceof Error ? error.message : "Verifique os campos preenchidos e tente novamente.";
            setError(mensagemErro);
            Alert.alert("Erro", mensagemErro);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        handleDeletarAuditoria,
        loading,
        error,
        success,
    };
}