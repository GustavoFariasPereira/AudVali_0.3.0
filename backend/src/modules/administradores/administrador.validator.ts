import bcrypt from "bcrypt";

export function validarAdministrador(
    senha: string,
    nome?: string
) {
    if(nome !== undefined){
        if(!nome || nome.trim().length < 3 || nome.trim().length > 20) {
            console.error("Nome deve possuir entre 3 e 20 caracteres");
            throw new Error("Nome deve possuir entre 3 e 20 caracteres");
        }
    }
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{25}$/;
    if(!senha || !regexSenha.test(senha)){
        console.error("Senha deve ter caractere especial, numero, letra minúscula, letra maiúscula e 25 dígitos.");
        throw new Error("Senha deve ter caractere especial, numero, letra minúscula, letra maiúscula e 25 dígitos.");
    }
}

export async function confirmarSenhaADM(
    hashSenhaBanco: string,
    confirmarSenha: string
) {
        const senhaFake = "$2b$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456789"; 
        
        const hashParaComparar = hashSenhaBanco || senhaFake;
        const senhaValida = await bcrypt.compare(confirmarSenha, hashParaComparar);

        if(!senhaValida){
            console.error("Credenciais inválidas.");
            throw new Error("Credenciais inválidas.");
        }

        return true;
}