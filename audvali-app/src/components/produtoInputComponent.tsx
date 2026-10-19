import { memo } from "react";
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { IProduto } from "../modules/produtos/produto.model";
import { Colors } from "../assets/colors/paleta01";

type CamposEditaveisProduto = Omit<IProduto, "id">;

const mascaraData = (texto: string) => {
  const numeros = texto.replace(/\D/g, "");

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
};

interface ProdutoLinhaProps {
  produto: IProduto;
  visualizar: boolean;
  isSelecionado: boolean;
  onToggle: (id: string) => void;
  onAlterarProduto: (
    id: string,
    campo: keyof CamposEditaveisProduto,
    valor: string,
  ) => void;
}

function ProdutoInput({
  produto,
  visualizar,
  isSelecionado,
  onToggle,
  onAlterarProduto,
}: ProdutoLinhaProps) {
  const parseDataParaExibicao = (d: any) => {
    if (!d) return "";
    if (typeof d === "string" && d.includes("-")) {
      const apenasDataPura = d.split("T")[0];
      const [ano, mes, dia] = apenasDataPura.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return d;
  };

  const idProduto = produto._id ?? produto.tempId!;

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <TouchableOpacity
          onPress={() => onToggle(idProduto)}
          activeOpacity={0.7}
        >
          <Image
            source={
              isSelecionado
                ? require("../assets/images/check_box_s.png")
                : require("../assets/images/check_box_outline.png")
            }
            style={styles.checkboxIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.rightColumn}>
        <TextInput
          style={styles.inputFull}
          value={String(produto.codigo ?? "")}
          editable={visualizar}
          keyboardType="numeric"
          placeholder="Código"
          placeholderTextColor={Colors.brand.gray}
          onChangeText={(text) => onAlterarProduto(idProduto, "codigo", text)}
        />

        <TextInput
          style={styles.inputFull}
          value={produto.nome ?? ""}
          editable={visualizar}
          placeholder="Nome"
          placeholderTextColor={Colors.brand.gray}
          onChangeText={(text) => onAlterarProduto(idProduto, "nome", text)}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.inputFull, { flex: 2 }]}
            value={parseDataParaExibicao(produto.validade)}
            placeholder="dd/mm/aaaa"
            keyboardType="numeric"
            editable={visualizar}
            placeholderTextColor={Colors.brand.gray}
            onChangeText={(text) => {
              const dataMascarada = mascaraData(text);
              onAlterarProduto(idProduto, "validade", dataMascarada);
            }}
          />
          <TextInput
            style={[styles.inputFull, { flex: 1 }]}
            value={String(produto.quantidade ?? "")}
            editable={visualizar}
            keyboardType="numeric"
            placeholder="Qtd"
            placeholderTextColor={Colors.brand.gray}
            onChangeText={(text) => onAlterarProduto(idProduto, "quantidade", text)}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(ProdutoInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.surface,
    marginVertical: 6,
    gap: 12,
  },
  leftColumn: {
    paddingTop: 6,
  },
  rightColumn: {
    flex: 1,
    gap: 10,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  inputFull: {
    height: 45,
    color: Colors.brand.lightest,
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: Colors.brand.red,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "rgba(255, 68, 68, 0.05)",
  },
  checkboxIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
});