export function validarProduto(
    codigo?: number,
    nome?: string,
    validade?: string,
    quantidade?: number
) {
    if(codigo !== undefined && (!codigo || codigo.toString().trim().length > 15 || !/^\d+$/.test(codigo.toString().trim()))){
        console.error("Código não pode ser nulo, superior a 15 caracteres ou não numérico.");
        throw new Error("Código não pode ser nulo, superior a 15 caracteres ou não numérico.");
    }

    if(nome !== undefined && (!nome || nome.trim().length > 60 || !/^(?!\s)[a-zA-Z0-9\p{L} ]+(?<!\s)$/u.test(nome.trim()))){
        console.error("Nome não pode ser nulo, deve conter apenas letras (com acentos), números e espaços, limite 60 caracteres.");
        throw new Error("Nome não pode ser nulo, deve conter apenas letras (com acentos), números e espaços, limite 60 caracteres.");
    }

    const hoje = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Sao_Paulo'
    });
    if(validade !== undefined && (!validade || validade < hoje)){
        console.error("Validade nula ou passada.");
        throw new Error("Validade nula ou passada.");
    }

    if(quantidade !== undefined && (quantidade === null || quantidade < 0 || quantidade > 1000)){
        console.error("Quantidade não pode ser nula, menor que 0 ou maior que 1000.");
        throw new Error("Quantidade não pode ser nula, menor que 0 ou maior que 1000.");
    }
}

export function validarInputProduto(
  campo: string,
  valor: string,
): string | null {
  switch (campo) {
    case "codigo":
        if (!valor || valor.trim() === "") return "Código é obrigatório!";
        if (valor.length > 15) return "Código maior que 15 dígitos!";
        if (!/^\d+$/.test(valor)) return "Código deve ser um número!";
        break;
    case "nome":
        if (!valor || valor.trim() === "") return "Nome é obrigatório!";
        if (valor.length > 60) return "Nome maior que 60 letras!";
        if (!/^(?!\s)[a-zA-Z0-9\p{L} ]+(?<!\s)$/u.test(valor.trim())) return "Nome deve conter apenas letras (com acentos), números e espaços!";
        break;
    case "validade":
        const partes = valor.split("/");
        if (partes.length !== 3) {
          return "Data incompleta. Use o formato DD/MM/AAAA.";
        }

        const [dia, mes, ano] = partes.map(Number);

        if (!dia || !mes || !ano || ano < 1000) {
          return "Data inválida.";
        }

        const dataProduto = new Date(ano, mes - 1, dia, 0, 0, 0, 0);

        if (
          isNaN(dataProduto.getTime()) ||
          dataProduto.getDate() !== dia ||
          dataProduto.getMonth() !== mes - 1 ||
          dataProduto.getFullYear() !== ano
        ) {
          return "Data inválida.";
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataProduto < hoje) {
          return "Validade passada.";
        }
        break;
    case "quantidade":
        if (!/^\d+$/.test(valor)) return "Quantidade deve ser um número";
        if (Number(valor) < 0) return "Quantidade deve ser positivo";
        if (Number(valor) > 1000) return "Quantidade não pode ser maior que 1000";
        break;
    default:
        return null;
  }
  return null;
}
