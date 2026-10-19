import { IProduto, IProdutoResponse } from "../produtos/produto.model";

export interface IAuditoria{
    _id?: string;
    nome: string;
    produtos: IProduto[];
    criadoPor: string;
}

export interface IAuditoriaResponse{
    _id: string;
    nome: string;
    produtos: IProdutoResponse[];
    criadoPor: string;
}