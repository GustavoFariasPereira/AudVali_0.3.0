import { Text, View, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors/paleta01";
import { IAuditoria } from "../../modules/auditorias/auditoria.model";
import { IProduto } from "../../modules/produtos/produto.model";
import { useAuthStore } from "../../stores/useAuthStore";
import { router } from "expo-router";
import { TErrosProdutos } from "../../types/errosProdutos";
import { useEffect, useState } from "react";
import { useAtualizarAuditoria, useDeletarAuditoria } from "../../modules/auditorias/auditoria.hook";
import { useAuditoriaStore, useDadosStore } from "../../stores/useAuditoriaStore";
import { validarInputProduto } from "@/modules/produtos/produto.validator";
import Auditoria from "../../components/auditoriaComponent";
import { ordenarLista } from "@/utils/ordenarProdutos";

export default function AtualizarAuditoria() {
  const user = useAuthStore((state) => state.user);

  const auditoriaSelecionada = useAuditoriaStore(
    (state) => state.auditoriaSelecionada,
  );
  const { editarItem, removerItem } = useDadosStore();
  const { limparSelecao } = useAuditoriaStore();

  const {
    handleAtualizarAuditoria,
    loading: loadingAtualizar,
  } = useAtualizarAuditoria();

  const {
    handleDeletarAuditoria,
  } = useDeletarAuditoria();

  const [selecionado, setSelecionado] = useState<IAuditoria | null>(null);
  const [produtosParaRemover, setProdutosParaRemover] = useState<string[]>([]);
  const [errosProdutos, setErrosProdutos] = useState<TErrosProdutos>({});
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const getIdProduto = (p: IProduto) => p._id ?? p.tempId ?? String(p.codigo);

  useEffect(() => {
    if (auditoriaSelecionada) {
      const auditoriaTratada: IAuditoria = {
        ...auditoriaSelecionada,
        produtos: auditoriaSelecionada.produtos?.map((produto) => {
          let dataValidade = produto.validade;

          if (typeof dataValidade === "string" && dataValidade.includes("-")) {
            const apenasDataPura = dataValidade.split("T")[0];
            const [ano, mes, dia] = apenasDataPura.split("-");

            dataValidade = `${dia}/${mes}/${ano}`;
          }

          return {
            ...produto,
            validade: dataValidade,
          };
        }),
      };

      const auditoriaOrdenada = ordenarLista(auditoriaTratada, true);

      setSelecionado(auditoriaOrdenada);
    }
  }, [auditoriaSelecionada]);

  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  const auditoriaFallback: IAuditoria = {
    nome: "Sem nome",
    produtos: [
      {
        codigo: Math.floor(Math.random() * 1000000),
        nome: "Sem nome",
        validade: `${dia}/${mes}/${ano}`,
        quantidade: 0,
      },
    ],
    criadoPor: user ? user.nome : "sem_usuario",
  };

  if (!auditoriaSelecionada || !selecionado) {
    return (
      <View>
        <Text>Nenhuma auditoria selecionada</Text>
      </View>
    );
  }

  if (!selecionado._id) {
    return (
      <View>
        <Text>Auditoria inválida</Text>
      </View>
    );
  }

  const handleExcluirAuditoriaAtual = () => {
    Alert.alert(
      "Excluir Auditoria",
      `Tem certeza que deseja excluir a auditoria "${selecionado.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!selecionado._id)
              return Alert.alert("Erro", "Auditoria não encontrada");

            await handleDeletarAuditoria(selecionado._id);
            removerItem(selecionado._id);
            limparSelecao();
            router.replace("/");
          },
        },
      ],
    );
  };

  const handleAlterarNomeAuditoria = (novoNome: string) => {
    if (!novoNome || novoNome.trim().length >= 49) {
      setErroNome("Nome nulo ou maior que 48 caracteres.");
    } else {
      setErroNome(null);
    }
    setSelecionado((prev) => (prev ? {
        ...prev,
        nome: novoNome,
    } : prev));
  };

  const handleAlterarProduto = (
    id: string,
    campo: keyof IProduto,
    valor: string,
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
        const novos = { ...prevErros };
        delete novos[id];
        return novos;
    }

    return {
        ...prevErros,
        [id]: produtoErros,
    };
    });

    setSelecionado((prev) =>
    prev
        ? {
            ...prev,
            produtos: prev.produtos?.map((p) =>
            getIdProduto(p) === id
                ? {
                    ...p,
                    [campo]: valor,
                    isModified: true,
                }
                : p,
            ),
        }
        : prev,
    );
  };

  const handleToggleSelecao = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleNovoProduto = () => {
    const novoId = Date.now();

    const novoProduto: IProduto = {
      tempId: novoId.toString(),
      codigo: Math.floor(Math.random() * 1000000),
      nome: "Nome",
      validade: `${dia}/${mes}/${ano}`,
      quantidade: 1,
      isModified: true,
    };

    setSelecionado((prev) =>
      prev
        ? {
            ...prev,
            produtos: [novoProduto, ...(prev.produtos ?? [])],
          }
        : prev,
    );
  };

  const handleAtualizar = async () => {
    const novosErros: TErrosProdutos = {};

    selecionado.produtos?.forEach((produto) => {
      const errosProduto: Record<string, string> = {};

      const erroCodigo = validarInputProduto(
        "codigo",
        String(produto.codigo ?? ""),
      );

      const erroNome = validarInputProduto("nome", String(produto.nome ?? ""));

      const erroQuantidade = validarInputProduto(
        "quantidade",
        String(produto.quantidade ?? ""),
      );

      const erroValidade = validarInputProduto("validade", produto.validade.toString());

      if (erroCodigo) errosProduto.codigo = erroCodigo;
      if (erroNome) errosProduto.nome = erroNome;
      if (erroQuantidade) errosProduto.quantidade = erroQuantidade;
      if (erroValidade) errosProduto.validade = erroValidade;

      if (Object.keys(errosProduto).length > 0) {
        novosErros[getIdProduto(produto) as string] = errosProduto;
      }
    });

    setErrosProdutos(novosErros);

    const nomeValido = !erroNome;
    const produtosValidos = Object.keys(novosErros).length === 0;
    const temProdutos = (selecionado.produtos?.length ?? 0) > 0;

    if (!nomeValido || !produtosValidos || !temProdutos) {
      return Alert.alert("Erro", "Verifique os dados antes de salvar");
    }

  const produtosParaEnviar = selecionado.produtos
        ?.filter((produto) => {
          const ehNovo = !produto._id;
          const foiModificado = (produto as any).isModified === true;
          return ehNovo || foiModificado;
        })
        .map((produto) => ({
          ...produto,
          validade:
            typeof produto.validade === "string" && produto.validade.includes("/")
              ? (() => {
                  const [dia, mes, ano] = produto.validade.split("/");
                  return `${ano}-${mes}-${dia}`;
                })()
              : produto.validade,
        })) ?? [];

    const novosDadosAuditoria: Partial<IAuditoria> = {
      nome: selecionado.nome,
      criadoPor: selecionado.criadoPor,
    };
    const auditoriaAtualizada = await handleAtualizarAuditoria(
      selecionado._id!,
      novosDadosAuditoria,
      produtosParaEnviar,
      produtosParaRemover
    );

    if (auditoriaAtualizada) {
      Alert.alert("Sucesso", "Auditoria atualizada com sucesso!");
      editarItem(auditoriaAtualizada);
      setErrosProdutos({});
      limparSelecao();
      router.replace("/");
    }
  };

  const handleDeletarSelecionados = async () => {
      const idsParaRemoverDoBanco = (selecionado.produtos ?? [])
      .filter((p) => selecionados.includes(getIdProduto(p)!) && p._id)
      .map((p) => p._id as string);

      if (idsParaRemoverDoBanco.length > 0) {
        setProdutosParaRemover((prev) => [...prev, ...idsParaRemoverDoBanco]);
      }

      const novosProdutos = (selecionado.produtos ?? []).filter(
        (p) => !selecionados.includes(getIdProduto(p) ?? p.codigo.toString()),
      );

      const atualizado = {
        ...selecionado,
        produtos: novosProdutos,
      };

      setSelecionado(atualizado);
      setSelecionados([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <View>
          <Text style={styles.title}>AudVali</Text>
          <View style={styles.indicator} />
        </View>

        <TouchableOpacity onPress={handleExcluirAuditoriaAtual}>
          <Image
            source={require("../../assets/images/delete.png")}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Auditoria
          auditoria={selecionado ?? auditoriaFallback}
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
          disabled={(selecionado.produtos?.length ?? 0) > 100}
          onPress={handleNovoProduto}
        >
          <Text
            style={
              (selecionado.produtos?.length ?? 0) > 100
                ? styles.actionButtonTextDisabled
                : styles.actionButtonText
            }
          >
            Novo Produto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.buttonSave]}
          disabled={(selecionado.produtos?.length ?? 0) > 100}
          onPress={handleAtualizar}
        >
          <Text
            style={
              (selecionado.produtos?.length ?? 0) > 100
                ? styles.actionButtonTextDisabled
                : styles.actionButtonText
            }
          >
            {loadingAtualizar ? "Atualizando..." : "Atualizar"}
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
  subtitle: { color: Colors.brand.gray, marginTop: 16, fontSize: 18 },
  buttonOutline: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.brand.border,
  },
  buttonOutlineText: { color: Colors.brand.lightest, fontWeight: "500" },
  disabledButton: {
    backgroundColor: "#333",
    opacity: 0.5,
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
  deleteIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.brand.red || "#FF4444",
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
