import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import Produto from "../components/produtoInputComponent";
import ProdutoVisualizar from "../components/produtoVisualizarComponent";
import Erro from "../components/erroComponent";
import type { TErrosProdutos } from "../types/errosProdutos";
import type { IProduto } from "../modules/produtos/produto.model";
import type { IAuditoria } from "../modules/auditorias/auditoria.model";
import { Colors } from "../assets/colors/paleta01";

type CamposEditaveisProduto = Omit<IProduto, "id">;

interface AuditoriasProps {
  auditoria: IAuditoria;
  visualizar: boolean;
  onAlterarProduto: (
    id: string,
    campo: keyof CamposEditaveisProduto,
    valor: string,
  ) => void;
  onAlterarNomeAuditoria: (nome: string) => void;
  selecionados: string[];
  onToggle: (id: string) => void;
  errosProdutos: TErrosProdutos;
  erroNome: string;
}

interface AuditoriaHeaderProps {
  visualizar: boolean;
  nome: string;
  onAlterarNomeAuditoria: (nome: string) => void;
  erroNome: string;
}

const AuditoriaHeader = React.memo(({
  visualizar,
  nome,
  onAlterarNomeAuditoria,
  erroNome,
}: AuditoriaHeaderProps) => {
  const [nomeLocal, setNomeLocal] = useState(nome);

  useEffect(() => {
    setNomeLocal(nome);
  }, [nome]);

  if (visualizar) {
    return (
      <Text style={[styles.title, styles.titleVisualizar]}>
        {nome}
      </Text>
    );
  }

  return (
    <>
      <TextInput
        style={styles.inputFull}
        value={nomeLocal}
        editable={true}
        placeholder="Nome da coleção"
        placeholderTextColor={Colors.brand.gray}
        onChangeText={(text) => {
          setNomeLocal(text);
          onAlterarNomeAuditoria(text);
        }}
      />
      <View style={styles.errorNome}>
        <Erro erro={erroNome} />
      </View>
    </>
  );
});

export default function Auditoria({
  auditoria,
  visualizar,
  onAlterarProduto,
  onAlterarNomeAuditoria,
  selecionados,
  onToggle,
  errosProdutos,
  erroNome,
}: AuditoriasProps) {

const getIdProduto = (p: IProduto) => {
    if (p._id) return String(p._id);
    if (p.tempId) return String(p.tempId);
    return String(p.codigo);
  };

  const renderItemProduto = ({ item: produto }: { item: IProduto }) => {
    const idUnico = getIdProduto(produto);
    const isSelecionado = selecionados.includes(idUnico);
    const erroDoProduto = errosProdutos?.[idUnico];

    return (
      <View style={styles.produtoWrapper}>
        {visualizar ? (
          <ProdutoVisualizar produto={produto} />
        ) : (
          <View>
            <Produto
              produto={produto}
              visualizar={true}
              isSelecionado={isSelecionado}
              onToggle={onToggle}
              onAlterarProduto={onAlterarProduto}
            />

            {erroDoProduto && (
              <View style={styles.erroContainer}>
                <Erro erro={erroDoProduto} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={auditoria.produtos ?? []}
      keyExtractor={getIdProduto}
      renderItem={renderItemProduto}
      ListHeaderComponent={
        <AuditoriaHeader
          visualizar={visualizar}
          nome={auditoria.nome}
          onAlterarNomeAuditoria={onAlterarNomeAuditoria}
          erroNome={erroNome}
        />
      }
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      initialNumToRender={12}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 220,
    paddingHorizontal: 10,
  },
  title: {
    color: Colors.brand.lightest,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  titleVisualizar: {
    fontSize: 28,
  },
  titleEditar: {
    fontSize: 22,
  },
  produtoWrapper: {
    marginBottom: 0,
  },
  erroContainer: {
    marginTop: 2,
    marginBottom: 6,
  },
  errorNome: {
    marginLeft: 10,
    marginBottom: 10,
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
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: "rgba(255, 68, 68, 0.05)",
  },
});