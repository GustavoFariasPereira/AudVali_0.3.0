export interface IUser{
    _id: string;
    nome: string;
    email: string;
}

export interface IUserADM{
    _id: string;
    nome: string;
    senhaAtualizadaEm: Date;
}

export type TipoUsuario = "colaborador" | "administrador";