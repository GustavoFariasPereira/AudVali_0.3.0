import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { logarColaborador, logarADM, logout as logoutApi } from "@/modules/auths/auth.service";
import { IUser, IUserADM, TipoUsuario } from "@/modules/auths/auth.model";
import { perfilColaborador } from "@/modules/colaboradores/colaborador.service";
import { perfilADM } from "@/modules/administradores/administrador.service";

interface AuthState {
    user: IUser | IUserADM | null;
    tipo: TipoUsuario | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    senhaExpirada: boolean;

    login: (email: string, senha: string) => Promise<void>;
    loginAdministrador: (nome: string, senha: string) => Promise<void>;
    carregarSessao: () => Promise<void>;
    logout: () => Promise<void>;
    limparSessao: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    tipo: null,
    isAuthenticated: false,
    isHydrated: false,
    senhaExpirada: false,

    login: async (email, senha) => {
        await logarColaborador(email, senha);
        await SecureStore.setItemAsync("auth_tipo", "colaborador");

        set({ tipo: "colaborador", isAuthenticated: true });
    },

    loginAdministrador: async (nome, senha) => {
        const { senhaExpirada } = await logarADM(nome, senha);
        await SecureStore.setItemAsync("auth_tipo", "administrador");

        set({ tipo: "administrador", isAuthenticated: true, senhaExpirada });
    },

    carregarSessao: async () => {
        try {
            const token = await SecureStore.getItemAsync("auth_token");

            if (!token) {
                set({ isAuthenticated: false, isHydrated: true });
                return;
            }

            const tipo =
                ((await SecureStore.getItemAsync("auth_tipo")) as TipoUsuario | null)
                ?? "colaborador";

            const userLogado =
                tipo === "administrador"
                    ? await perfilADM()
                    : await perfilColaborador();

            set({
                user: userLogado,
                tipo,
                isAuthenticated: true,
                isHydrated: true,
            });

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 403 && error.response?.data?.codigo === "SENHA_EXPIRADA") {
                    set({
                        tipo: "administrador",
                        isAuthenticated: true,
                        senhaExpirada: true,
                        isHydrated: true,
                    });
                    return;
                }

                if (status === 401) {
                    await SecureStore.deleteItemAsync("auth_token");
                    await SecureStore.deleteItemAsync("auth_tipo");
                }
            }

            set({
                user: null,
                tipo: null,
                isAuthenticated: false,
                isHydrated: true,
            });
        }
    },

    limparSessao: async () => {
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("auth_tipo");

        set({
            user: null,
            tipo: null,
            isAuthenticated: false,
            senhaExpirada: false,
        });
    },

    logout: async () => {
        try {
            await logoutApi(); // o interceptor coloca o token no header
        } catch {
            // ignora: o logout local acontece de qualquer forma
        } finally {
            await get().limparSessao();
        }
    },
}));