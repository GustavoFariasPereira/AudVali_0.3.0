export function validarColaborador(
    email: string,
    senha: string,
    nome?: string
) {
    if(nome !== undefined){
        if (!nome || nome.trim().length < 3 || nome.trim().length > 20) {
            console.error("Nome deve possuir entre 3 e 20 caracteres");
            throw new Error("Nome deve possuir entre 3 e 20 caracteres");
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
        console.error("E-mail inválido");
        throw new Error("E-mail inválido");
    }

    const regexSenha = /^[a-zA-Z0-9]{8}$/;
    if (!senha || senha.length < 8 || !regexSenha.test(senha)) {
        console.error("A senha deve possuir pelo menos 8 caracteres e conter apenas letras e números");
        throw new Error("A senha deve possuir pelo menos 8 caracteres e conter apenas letras e números");
    }
}