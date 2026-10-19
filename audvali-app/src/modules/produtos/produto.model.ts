export interface IProduto{
    _id?: string;
    tempId?: string;
    codigo: number;
    nome: string;
    validade: Date | string;
    quantidade: number;
    isModified?: boolean;
}

export interface IProdutoResponse{
    _id: string;
    codigo: number;
    nome: string;
    validade: Date;
    quantidade: number;
}