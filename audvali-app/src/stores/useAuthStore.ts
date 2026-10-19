import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { logarColaborador } from "@/modules/auths/auth.service";
import axios from "axios";
import { IUser } from "@/modules/auths/auth.model";
import { perfilColaborador } from "@/modules/colaboradores/colaborador.service";

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    isHydrated: boolean;

    login: (email: string, senha: string) => Promise<void>;
    carregarSessao: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isHydrated: false,

    login: async (email, senha) => {
        await logarColaborador(email, senha);

        set({
            isAuthenticated: true,
        });
    },

    carregarSessao: async () => {
        try {
            const token = await SecureStore.getItemAsync("auth_token");

            if (!token) {
                set({
                    isAuthenticated: false,
                    isHydrated: true,
                });

                return;
            }

            const userLogado = await perfilColaborador(token);

            set({
                user: userLogado,
                isAuthenticated: true,
                isHydrated: true,
            });

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                if (error.response?.status === 401) {

                    await SecureStore.deleteItemAsync("auth_token");

                    set({
                        user: null,
                        isAuthenticated: false,
                        isHydrated: true,
                    });

                    return;
                }
            }

            set({
                user: null,
                isAuthenticated: false,
                isHydrated: true,
            });
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync("auth_token");

        set({
            isAuthenticated: false,
        });
    },
}));