function converterParaTimestamp(data: string | Date): number {
  if (data instanceof Date) {
    return data.getTime();
  }

  if (!data || typeof data !== "string") return NaN;

  if (data.includes("/")) {
    const [dia, mes, ano] = data.split("/").map(Number);
    return new Date(ano, mes - 1, dia).getTime();
  }

  if (data.includes("-")) {
    const apenasData = data.includes("T") ? data.split("T")[0] : data;
    const [ano, mes, dia] = apenasData.split("-").map(Number);
    return new Date(ano, mes - 1, dia).getTime();
  }

  return new Date(data).getTime();
}

export function ordenarLista(auditoria: any, listaCompleta?: boolean): any {
  if (!auditoria) return null;

  const produtos = auditoria.produtos;

  if (!Array.isArray(produtos)) {
    return { ...auditoria, produtos: [] };
  }

  if(listaCompleta){
       const produtosOrdenados = [...produtos]
    .filter((p) => {
      const temValidadeValida = p?.validade && p.validade !== "Data inválida";

      return p && temValidadeValida;
    })
    .sort((a, b) => {
      const dataA = converterParaTimestamp(a.validade);
      const dataB = converterParaTimestamp(b.validade);

      if (isNaN(dataA) && isNaN(dataB)) return 0;
      if (isNaN(dataA)) return 1;
      if (isNaN(dataB)) return -1;

      return dataA - dataB;
    });
        return {
        ...auditoria,
        produtos: produtosOrdenados,
      };
    }

  const produtosOrdenados = [...produtos]
    .filter((p) => {
      const qtd = Number(p?.quantidade);

      const temValidadeValida = p?.validade && p.validade !== "Data inválida";

      return p && !isNaN(qtd) && qtd > 0 && temValidadeValida;
    })
    .sort((a, b) => {
      const dataA = converterParaTimestamp(a.validade);
      const dataB = converterParaTimestamp(b.validade);

      if (isNaN(dataA) && isNaN(dataB)) return 0;
      if (isNaN(dataA)) return 1;
      if (isNaN(dataB)) return -1;

      return dataA - dataB;
    });

  return {
    ...auditoria,
    produtos: produtosOrdenados,
  };
}
