export function validarCadastroColaborador(
    email: string,
    senha: string,
    nome?: string
) {
    if(nome !== undefined){
        if (!nome || nome.trim().length < 3 || nome.trim().length > 20) {
        throw new Error("Nome deve possuir entre 3 e 20 caracteres");
    }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
        throw new Error("E-mail inválido");
    }

    const regexSenha = /^[a-zA-Z0-9]{8}$/;
    if (!senha || senha.length < 8 || !regexSenha.test(senha)) {
        throw new Error("A senha deve possuir pelo menos 8 caracteres e conter apenas letras e números");
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