import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Auditoria from "../../components/auditoriaComponent";
import ErroTelaCheia from "../../components/erroTelaCheiaComponent";
import { Colors } from "../../assets/colors/paleta01";
import { useAuditoriaStore } from "../../stores/useAuditoriaStore";
import { ordenarLista } from "../../utils/ordenarProdutos"
import { router } from "expo-router";
import { useMemo } from "react";
import { exportarAuditoriaPDF } from "../../utils/exportarAuditoria";

export default function Visualizar() {
  const dados = useAuditoriaStore((state) => state.auditoriaSelecionada);

    const dadosOrdenados = useMemo(() => {
    return ordenarLista(dados);
  }, [dados]);

  const errosProdutos = {};

  if (!dados && !dadosOrdenados) {
    return <ErroTelaCheia mensagem="Auditoria não encontrada" />;
  }

  const handleAlterar = () => {};

  const handleExportar = () => {
    exportarAuditoriaPDF(dadosOrdenados);
  };
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              handleAlterar();
              router.replace("/atualizarAuditoria");
            }}
            style={[styles.actionButton, styles.buttonAlterar]}
          >
            <Text style={styles.buttonText}>Alterar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExportar}
            style={[styles.actionButton, styles.buttonExportar]}
          >
            <Text style={styles.buttonText}>Exportar</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.colecaoContainer}>
          <Auditoria
            auditoria={dadosOrdenados}
            visualizar={true}
            onAlterarProduto={() => {}}
            onAlterarNomeAuditoria={() => {}}
            selecionados={[]}
            onToggle={() => {}}
            errosProdutos={errosProdutos}
            erroNome=""
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#380401",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#FFF" },
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.darkest,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.brand.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 10,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  exportButton: {
    width: 120,
    paddingVertical: 10,
    backgroundColor: "#2D2D2D",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  exportText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  colecaoContainer: {
    width: "100%",
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 100,
    alignItems: "center",
  },
  buttonAlterar: {
    backgroundColor: Colors.brand.darkest,
    borderWidth: 1,
    borderColor: Colors.brand.muted,
    flex: 0.3,
  },
  buttonExportar: {
    backgroundColor: Colors.brand.muted,
    borderWidth: 1,
    borderColor: Colors.brand.darkest,
    flex: 2,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});