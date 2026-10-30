import { IProduto } from "../produtos/produto.model";

export function validarAuditoria(
  nome?: string,
  criadoPor?: string,
  produtos?: IProduto[]
) {
  if (nome !== undefined && (!nome || nome.trim().length >= 49)) {
    console.error("Nome deve ter até 48 caracteres.");
    throw new Error("Nome deve ter até 48 caracteres.");
  }

  if (produtos !== undefined && !produtos) {
    console.error("A lista de produtos fornecida é inválida.");
    throw new Error("A lista de produtos fornecida é inválida.");
  }

  if (criadoPor !== undefined && (criadoPor.trim().length <= 2 || criadoPor.trim().length >= 21)) {
    console.error("CriadoPor deve ter entre 3 e 20 caracteres.");
    throw new Error("CriadoPor deve ter entre 3 e 20 caracteres.");
  }
}