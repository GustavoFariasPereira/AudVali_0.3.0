import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/colors/paleta01";
import { useDadosStore } from "../stores/useAuditoriaStore";
import { useEffect, useState } from "react";
import * as Network from "expo-network";

export default function Index() {
  const router = useRouter();
  const maxColecoes = useDadosStore((state) => state.dados.length);
  const isDisabled = maxColecoes >= 8;

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: any = null;

    async function startMonitoring() {
      setLoadingStatus(true);

      const state = await Network.getNetworkStateAsync();
      const temInternet = !!(state.isConnected && state.isInternetReachable);
      setIsOnline(temInternet);

      setLoadingStatus(false);

      unsubscribe = Network.addNetworkStateListener(async (state) => {
        const conectou = !!(state.isConnected && state.isInternetReachable);
        setIsOnline(conectou);
      });
    }

    startMonitoring();

    return () => {
      if (unsubscribe && typeof unsubscribe.remove === "function") {
        unsubscribe.remove();
      }
    };
  }, []);

  const obterStatusVisual = () => {
    if (loadingStatus)
      return {
        texto: "Verificando...",
        cor: Colors.brand.gray,
        mensagem: "Atualizando conexões...",
      };
    if (!isOnline)
      return {
        texto: "Offline",
        cor: Colors.brand.red || "#FF4444",
        mensagem: "Sem conexão com a internet",
      };
    return {
      texto: "Online",
      cor: Colors.brand.green,
      mensagem: "Pronto para iniciar nova auditoria",
    };
  };

  const statusVisual = obterStatusVisual();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>AudVali</Text>
            <View style={styles.indicator} />
            <Text style={styles.subtitle}>Gerenciamento de auditorias inteligente.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Status do Sistema</Text>
            <Text style={styles.cardText}>{statusVisual.mensagem}</Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusVisual.cor },
                ]}
              />
              <Text style={[styles.statusText, { color: statusVisual.cor }]}>
                {statusVisual.texto}
              </Text>
            </View>
          </View>

          <View style={styles.buttonGap}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              activeOpacity={0.8}
              onPress={() => router.push("/(app)/menuAuditorias" as any)}
            >
              <Text style={styles.buttonPrimaryText}>Acessar Auditorias</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                isDisabled ? styles.buttonOutlineDisabled : styles.buttonOutline
              }
              activeOpacity={0.7}
              disabled={isDisabled || !isOnline}
              onPress={() => router.push("/(app)/criarAuditoria" as any)}
            >
              <Text
                style={
                  isDisabled
                    ? styles.buttonOutlineTextDisabled
                    : styles.buttonOutlineText
                }
              >
                Nova Auditoria
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>AudVali © 2026 - {new Date().getFullYear()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.darkest,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  title: {
    color: Colors.brand.lightest,
    fontSize: 36,
    fontWeight: "bold",
  },
  indicator: {
    height: 4,
    width: 48,
    backgroundColor: Colors.brand.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  subtitle: {
    color: Colors.brand.gray,
    marginTop: 16,
    fontSize: 18,
  },
  card: {
    backgroundColor: Colors.brand.surface,
    borderWidth: 1,
    borderColor: Colors.brand.border,
    padding: 24,
    borderRadius: 24,
    marginVertical: 32,
  },
  cardLabel: {
    color: Colors.brand.primary,
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 1,
  },
  cardText: {
    color: Colors.brand.lightest,
    fontSize: 20,
    marginTop: 8,
    fontWeight: "500",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand.green,
    marginRight: 8,
  },
  statusText: {
    color: Colors.brand.green,
    fontSize: 14,
  },
  buttonGap: {
    gap: 16,
  },
  buttonPrimary: {
    backgroundColor: Colors.brand.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: Colors.brand.darkest,
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonOutline: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.brand.border,
  },
  buttonOutlineDisabled: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.brand.border,
    opacity: 0.5,
  },
  buttonOutlineText: {
    color: Colors.brand.lightest,
    fontWeight: "500",
  },
  buttonOutlineTextDisabled: {
    color: Colors.brand.border,
    fontWeight: "500",
  },
  footer: {
    color: Colors.brand.gray,
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
});
