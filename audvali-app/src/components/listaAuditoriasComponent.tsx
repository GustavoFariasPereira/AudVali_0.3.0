import React from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import type { IAuditoria } from "../modules/auditorias/auditoria.model";

interface ListaProps {
  listas: IAuditoria[];
  onSelecionar: (lista: IAuditoria) => void;
  selecionadoId?: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement;
}

export default function Lista({
  listas,
  onSelecionar,
  selecionadoId,
  ListFooterComponent,
  ListHeaderComponent,
}: ListaProps) {
  const renderItem = ({ item }: { item: IAuditoria }) => {
    const isSelected = selecionadoId === item._id;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          onSelecionar(item);
        }}
        style={[
          styles.card,
          isSelected ? styles.cardSelected : styles.cardUnselected,
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.nome}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.dot} />
            <Text style={styles.subtitle}>
              {item.produtos?.length || 0}{" "}
              {item.produtos?.length === 1 ? "item" : "itens"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={listas}
      keyExtractor={(item) => (item._id || Math.random()).toString()}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.listPadding}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listPadding: { paddingBottom: 20, paddingHorizontal: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardSelected: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderColor: "#FFD700",
  },
  cardUnselected: {
    backgroundColor: "#1A1A1A",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  content: { flexDirection: "column", gap: 4 },
  title: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 215, 0, 0.6)",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.4)",
  },
});
