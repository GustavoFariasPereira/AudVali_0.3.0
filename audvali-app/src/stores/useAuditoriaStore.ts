import { create } from "zustand";
import { IAuditoria } from "../modules/auditorias/auditoria.model";
import { api } from "../api";

interface AuditoriaState {
  auditoriaSelecionada: IAuditoria | null;
  setAuditoriaSelecionada: (auditoria: IAuditoria | null) => void;
  limparSelecao: () => void;
}

export const useAuditoriaStore = create<AuditoriaState>((set) => ({
  auditoriaSelecionada: null,
  setAuditoriaSelecionada: (auditoria) => set({ auditoriaSelecionada: auditoria }),
  limparSelecao: () => set({ auditoriaSelecionada: null }),
}));

interface ApiResponse {
  message: string;
  auditorias: IAuditoria[];
  success?: boolean;
}

interface MeusDadosStore {
  dados: IAuditoria[];
  hasLoaded: boolean;
  isLoading: boolean;
  fetchDados: () => Promise<void>;
  refreshDados: () => Promise<void>;
  adicionarItem: (novoItem: IAuditoria) => void;
  editarItem: (itemAtualizado: IAuditoria) => void;
  removerItem: (id: string) => void;
}

export const useDadosStore = create<MeusDadosStore>((set, get) => ({
  dados: [],
  hasLoaded: false,
  isLoading: false,

  fetchDados: async () => {
    if (get().hasLoaded) return;

    set({ isLoading: true });
    try {
      const resposta = await api.get<ApiResponse>("/api/auditorias/listar");
      set({ dados: resposta.data.auditorias, hasLoaded: true });
    } catch (error) {
      console.error("Erro ao buscar auditorias:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshDados: async () => {
    set({ isLoading: true });
    try {
      const resposta = await api.get<ApiResponse>("/api/auditorias/listar");
      set({ dados: resposta.data.auditorias, hasLoaded: true });
    } catch (error) {
      console.error("Erro ao atualizar auditorias:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  adicionarItem: (novoItem) =>
    set((state) => ({
      dados: [...state.dados, novoItem],
    })),

  editarItem: (itemAtualizado) =>
    set((state) => ({
      dados: state.dados.map((item) =>
        item._id === itemAtualizado._id ? itemAtualizado : item,
      ),
    })),

  removerItem: (id) =>
    set((state) => ({
      dados: state.dados.filter((item) => item._id !== id),
    })),
}));
