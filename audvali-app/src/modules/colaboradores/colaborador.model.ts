export interface IColaborador {
    nome: string;
    email: string;
    senha: string;
    tentativas: number;
    bloqueado: boolean;
    emailVerificado: boolean;
};