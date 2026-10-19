import { View, Text, StyleSheet } from "react-native";
import type { IProduto } from "../modules/produtos/produto.model";
import { Colors } from "../assets/colors/paleta01";

export default function ProdutoVisualizar({ produto }: { produto: IProduto }) {

  const formatarData = (dataOriginal: Date | string | undefined) => {
    if (!dataOriginal) return "S/ DATA";

    if (typeof dataOriginal === "string") {

      if (dataOriginal.includes("/")) {
        return dataOriginal;
      }

      const [dataIso] = dataOriginal.split("T");
      const [ano, mes, dia] = dataIso.split("-");

      return `${dia}/${mes}/${ano}`;
    }

    return dataOriginal.toLocaleDateString("pt-BR");
  };
  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.nomeRow}>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            COD: {produto.codigo}
          </Text>
        </View>

        <View style={styles.topRow}>
          <View style={[styles.section, styles.bgBorder, { flex: 2.5 }]}>
            <Text style={styles.text} numberOfLines={1}>
              VAL: {formatarData(produto.validade)}
            </Text>
          </View>

          <View style={[styles.section, styles.bgBorder, { flex: 1.5 }]}>
            <Text style={styles.text}>QTD: {produto.quantidade}</Text>
          </View>
        </View>

        <View style={styles.nomeRow}>
          <Text style={styles.textSmall} numberOfLines={1} ellipsizeMode="tail">
            {produto.nome}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 4,
  },
  card: {
    width: "95%",
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.surface,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    gap: 4,
  },
  nomeRow: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  section: {
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  bgBorder: {
    backgroundColor: Colors.brand.border,
    borderRadius: 6,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: Colors.brand.lightest,
    fontWeight: "bold",
    textAlign: "center",
  },
  textSmall: {
    fontSize: 12,
    color: Colors.brand.lightest,
    fontWeight: "bold",
    textAlign: "center",
  },
});
