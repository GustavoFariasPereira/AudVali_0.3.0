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