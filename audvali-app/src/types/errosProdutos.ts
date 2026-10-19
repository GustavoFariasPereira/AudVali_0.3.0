import type { IProduto } from "../modules/produtos/produto.model";

export type TErrosProdutos = Record<
  string,
  Partial<Record<keyof IProduto, string>>
>;