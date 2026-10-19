import { useState } from "react";
import { router } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors/paleta01";
import { IAuditoria } from "../../modules/auditorias/auditoria.model";
import { IProduto } from "../../modules/produtos/produto.model";
import { TErrosProdutos } from "../../types/errosProdutos";
import Auditoria from "../../components/auditoriaComponent";
import { validarAuditoria } from "@/modules/auditorias/auditoria.validator";
import { validarInputProduto } from "../../modules/produtos/produto.validator";
import { useCriarAuditoria } from "../../modules/auditorias/auditoria.hook";
import { useAuthStore } from "../../stores/useAuthStore";
import { useDadosStore } from "../../stores/useAuditoriaStore";

export default function NovaAuditoria() {
  const user = useAuthStore((state) => state.user);
  const { adicionarItem } = useDadosStore();

  const {
    handleCriarAuditoria,
    loading: loadingCriar,
  } = useCriarAuditoria();

  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  const auditoriaInicial: IAuditoria = {
    nome: "Sem nome",
    produtos: [
      {
        tempId: Date.now().toString(),
        codigo: Math.floor(Math.random() * 1000000),
        nome: "Sem nome",
        validade: `${dia}/${mes}/${ano}`,
        quantidade: 0,
      },
    ],
    criadoPor: user ? user.nome : "sem_usuario",
  };

  const [selecionado, setSelecionado] = useState<IAuditoria>(auditoriaInicial);
  const [errosProdutos, setErrosProdutos] = useState<TErrosProdutos>({});
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const handleAlterarNomeAuditoria = (novoNome: string) => {
    if (!novoNome || novoNome.trim().length >= 49) {
      setErroNome("Nome nulo ou maior que 48 caracteres.");
    } else {
      setErroNome(null);
    }
    setSelecionado((prev) => ({
      ...prev,
      nome: novoNome,
    }));
  };

  const handleAlterarProduto = (
    id: string,
    campo: keyof IProduto,
    valor: any
  ) => {
    const mensagemErro = validarInputProduto(campo, valor);

    setErrosProdutos((prevErros) => {
      const produtoErros = { ...(prevErros[id] || {}) };

      if (!mensagemErro) {
        delete produtoErros[campo];
      } else {
        produtoErros[campo] = mensagemErro;
      }

      if (Object.keys(produtoErros).length === 0) {
        const novosErros = { ...prevErros };
        delete novosErros[id];
        return novosErros;
      }

      return {
        ...prevErros,
        [id]: produtoErros,
      };
    });

    setSelecionado((prev) => ({
      ...prev,
      produtos: prev.produtos?.map((prod) =>
        (prod._id ?? prod.tempId ?? prod.codigo.toString()) === id
          ? { ...prod, [campo]: valor }
          : prod
      ),
    }));
  };

  const handleToggleSelecao = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNovoProduto = () => {
    const novoId = Date.now().toString();

    const novoProduto: IProduto = {
      tempId: novoId,
      codigo: Math.floor(Math.random() * 1000000),
      nome: "Nome",
      validade: `${dia}/${mes}/${ano}`,
      quantidade: 1,
    };

    setSelecionado((prev) => ({
      ...prev,
      produtos: [novoProduto, ...(prev.produtos ?? [])],
    }));
  };

  const handleSalvar = async () => {
    const nomeValido = !erroNome && selecionado.nome.trim() !== "";
    const produtosValidos = Object.keys(errosProdutos).length === 0;
    const temProdutos = (selecionado?.produtos?.length ?? 0) > 0;

    if (!nomeValido || !produtosValidos || !temProdutos) {
      Alert.alert(
        "Não foi possível salvar",
        "Verifique se o nome da coleção está correto e se há erros nos produtos."
      );
      return;
    }

    try {
      validarAuditoria(
        selecionado?.nome ?? "",
        user ? user.nome : "sem_usuario",
        selecionado?.produtos ?? []
      );

     const auditoriaParaSalvar: IAuditoria = {
  ...selecionado,
  produtos: selecionado.produtos?.map((produto) => {
    let dataValidade: Date;

    if (typeof produto.validade === "string" && produto.validade.includes("/")) {
      const [dia, mes, ano] = produto.validade.split("/").map(Number);
      dataValidade = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0, 0));
    } 
    else if (produto.validade instanceof Date) {
      dataValidade = new Date(
        Date.UTC(
          produto.validade.getUTCFullYear(),
          produto.validade.getUTCMonth(),
          produto.validade.getUTCDate(),
          0, 0, 0, 0
        )
      );
    } 
    else {
      dataValidade = new Date();
    }

    return {
      ...produto,
      codigo: Number(produto.codigo),
      validade: dataValidade,
      quantidade: Number(produto.quantidade),
    };
  }),
};

      const resultado = await handleCriarAuditoria(auditoriaParaSalvar);

      if (resultado) {
        adicionarItem(resultado);
        Alert.alert("Sucesso", "Coleção salva com sucesso!");
        router.replace("/");
      }
    } catch (error: any) {
      Alert.alert("Erro ao salvar", error.message || "Erro inesperado.");
    }
  };

  const handleDeletarSelecionados = () => {
    if (!selecionado) return;

    // 1. Filtra mantendo apenas os produtos que NÃO foram selecionados
    const novosProdutos = (selecionado.produtos ?? []).filter(
      (p) => !selecionados.includes(p._id ?? p.tempId ?? p.codigo.toString())
    );

    // 2. Limpa os erros associados aos produtos removidos
    setErrosProdutos((errosAtuais) => {
      const novosErros = { ...errosAtuais };

      // Percorre cada ID que foi selecionado para exclusão e apaga sua chave de erro
      selecionados.forEach((id) => {
        delete novosErros[id];
      });

      return novosErros;
    });

    // 3. Atualiza os produtos e limpa as seleções da tela
    setSelecionado({ ...selecionado, produtos: novosProdutos });
    setSelecionados([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.title}>AudVali</Text>
          <View style={styles.indicator} />
        </View>
      </View>

      <View style={styles.listContainer}>
        <Auditoria
          auditoria={selecionado}
          visualizar={false}
          onAlterarProduto={handleAlterarProduto}
          selecionados={selecionados}
          onToggle={handleToggleSelecao}
          onAlterarNomeAuditoria={handleAlterarNomeAuditoria}
          errosProdutos={errosProdutos}
          erroNome={erroNome!}
        />
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.buttonAdd]}
          disabled={(selecionado.produtos?.length ?? 0) >= 100}
          onPress={handleNovoProduto}
        >
          <Text
            style={
              (selecionado.produtos?.length ?? 0) >= 100
                ? styles.actionButtonTextDisabled
                : styles.actionButtonText
            }
          >
            Novo Produto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.buttonSave]}
          disabled={loadingCriar || (selecionado.produtos?.length ?? 0) > 100}
          onPress={handleSalvar}
        >
          <Text
            style={
              (selecionado.produtos?.length ?? 0) > 100
                ? styles.actionButtonTextDisabled
                : styles.actionButtonText
            }
          >
            {loadingCriar ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>

        {selecionados.length > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.buttonDelete]}
            onPress={handleDeletarSelecionados}
          >
            <Text style={styles.actionButtonText}>
              Excluir [{selecionados.length}]
            </Text>
          </TouchableOpacity>
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  fixedFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingBottom: 10,
    backgroundColor: Colors.brand.darkest,
  },
  footerText: {
    color: Colors.brand.gray,
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
  },
  actionBar: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  buttonAdd: {
    backgroundColor: Colors.brand.muted,
    borderWidth: 1,
    borderColor: Colors.brand.darkest,
    flex: 1.2,
  },
  buttonSave: {
    backgroundColor: Colors.brand.darkest,
    borderWidth: 1,
    borderColor: Colors.brand.muted,
  },
  buttonDelete: {
    backgroundColor: Colors.brand.muted,
    borderWidth: 2,
    borderColor: Colors.brand.darkest,
    position: "absolute",
    right: 16,
    top: -60,
    width: 150,
    borderRadius: 25,
    elevation: 8,
  },
  actionButtonText: {
    color: Colors.brand.lightest,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionButtonTextDisabled: {
    color: Colors.brand.primary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fixedHeader: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextGroup: {
    flexDirection: "column",
  },
  title: {
    color: Colors.brand.lightest,
    fontSize: 32,
    fontWeight: "bold",
  },
  indicator: {
    height: 4,
    width: 48,
    backgroundColor: Colors.brand.primary,
    marginTop: 4,
    borderRadius: 2,
  },
});