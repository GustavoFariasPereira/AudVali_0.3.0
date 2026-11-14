import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://192.168.1.129:3000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { "content-type": "application/json" },
});

// Callback registrado pelo app (layout raiz), chamado quando a sessão não vale mais
let aoSessaoExpirar: (() => void | Promise<void>) | null = null;

export function registrarAoSessaoExpirar(fn: () => void | Promise<void>) {
    aoSessaoExpirar = fn;
}

// Rotas em que um 401 NÃO significa "sessão expirada"
const ROTAS_IGNORADAS = ["/login", "/logout", "/cadastrar"];

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    async (response) => {
        const novoToken = response.headers["x-new-token"];
        if (novoToken) {
            await SecureStore.setItemAsync("auth_token", novoToken);
        }
        return response;
    },
    async (error) => {
        const url: string = error.config?.url ?? "";
        const ignorada = ROTAS_IGNORADAS.some((rota) => url.includes(rota));

        if (error.response?.status === 401 && !ignorada) {
            // Só age se ainda há token: requisições paralelas que falham depois
            // da limpeza não disparam o callback de novo
            const token = await SecureStore.getItemAsync("auth_token");
            if (token) {
                await aoSessaoExpirar?.();
            }
        }

        return Promise.reject(error);
    }
);