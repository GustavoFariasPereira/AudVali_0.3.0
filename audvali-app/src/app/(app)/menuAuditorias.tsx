import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors/paleta01";
import Lista from "../../components/listaAuditoriasComponent";
import { router } from "expo-router";
import { useAuditoriaStore } from "../../stores/useAuditoriaStore";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useDadosStore } from "../../stores/useAuditoriaStore";

export default function menu() {
  const user = useAuthStore((state) => state.user);
  const setAuditoria = useAuditoriaStore((state) => state.setAuditoriaSelecionada);

  const { dados, hasLoaded, fetchDados } = useDadosStore();

  useEffect(() => {
    fetchDados();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>AudVali</Text>
        <View style={styles.indicator} />
        <Text style={styles.subtitle}>Gerenciamento de auditorias.</Text>
      </View>

      <View style={styles.listContainer}>
        {!hasLoaded && <Text style={styles.carregandoText}>Carregando...</Text>}

        {!dados && (
          <Text style={styles.erroText}>
            Erro: Não foi possível carregar as auditorias.
          </Text>
        )}
        {dados && dados.length > 0 ? (
          <Lista
            listas={dados}
            onSelecionar={(itemClicado) => {
              setAuditoria(itemClicado);
              router.push("/visualizarAuditoria");
            }}
          />
        ) : (
          !hasLoaded || dados.length === 0 && (
            <Text style={styles.carregandoText}>
              Nenhuma auditoria encontrada 
              {"\n"}{"\n"}
              para o usuário:    {user?.nome || "Desconhecido"}
            </Text>
          )
        )}
      </View>

      <View style={styles.fixedFooter}>
        <Text style={styles.footerText}>AudVali © 2026 - {new Date().getFullYear()}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.darkest,
  },
  fixedHeader: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  fixedFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  footerText: {
    color: Colors.brand.gray,
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
  },
  title: { color: Colors.brand.lightest, fontSize: 36, fontWeight: "bold" },
  indicator: {
    height: 4,
    width: 48,
    backgroundColor: Colors.brand.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  subtitle: { color: Colors.brand.gray, marginTop: 16, fontSize: 18 },
  buttonOutline: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.brand.border,
  },
  buttonOutlineText: { color: Colors.brand.lightest, fontWeight: "500" },
  erroText: {
    color: Colors.brand.lightest,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  carregandoText: {
    color: Colors.brand.lightest,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    paddingHorizontal: 18,
  },
});
