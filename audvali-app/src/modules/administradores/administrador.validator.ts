export function validarAdministrador(
    senha: string,
    nome?: string
) {
    if(nome !== undefined){
        if(!nome || nome.trim().length < 3 || nome.trim().length > 20) {
            throw new Error("Nome deve possuir entre 3 e 20 caracteres");
        }
    }
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{25}$/;
    if(!senha || !regexSenha.test(senha)){
        throw new Error("Senha deve ter caractere especial, numero, letra minúscula, letra maiúscula e 25 dígitos.");
    }
}

export function confirmarSenha(
    senha: string, 
    confirmarSenha: string
) {
    if(senha !== confirmarSenha){
        throw new Error("Senhas não coincidem.");
    }
}