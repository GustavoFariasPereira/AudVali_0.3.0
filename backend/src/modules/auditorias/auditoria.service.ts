import { Colaborador } from "../colaboradores/colaborador.model";
import { IProduto } from "../produtos/produto.model";
import { validarProduto } from "../produtos/produto.validator";
import { Auditoria, IAuditoria } from "./auditoria.model";
import { validarAuditoria } from "./auditoria.validator";
import { Types } from "mongoose";

export async function criarAuditoria(
    auditoria: IAuditoria
) {
    validarAuditoria(auditoria.nome, auditoria.criadoPor, auditoria.produtos);

    const qtdAuditorias = await Auditoria.countDocuments({
        criadoPor: auditoria.criadoPor.trim(),
    });

    if(qtdAuditorias >= 8){
        console.error("Limite de 8 auditorias atingido.");
        throw new Error("Limite de 8 auditorias atingido.");
    }

    if(auditoria.produtos.length > 100){
        console.error("Limite de 100 produtos por auditoria atingido.");
        throw new Error("Limite de 100 produtos por auditoria atingido.");
    }

    for (const produto of auditoria.produtos){
        validarProduto(produto.codigo, produto.nome, produto.validade.toString(), produto.quantidade);
    }
    
    return (
        Auditoria.create({
            nome: auditoria.nome.trim(),
            produtos: auditoria.produtos,
            criadoPor: auditoria.criadoPor,
        })
    )
}

export async function atualizarAuditoria(
  _idAuditoria: string,
  _idColaborador: string,
  novosDadosAuditoria: Partial<IAuditoria>,
  novosDadosProdutos?: Partial<IProduto>[],
  produtosParaRemover?: string[]
) {
  validarAuditoria(novosDadosAuditoria?.nome, novosDadosAuditoria?.criadoPor);

  if (!_idColaborador) {
    console.error("Não autorizado.");
    throw new Error("Não autorizado.");
  }

  const colaborador = await Colaborador.findById(_idColaborador).exec();

  if (!colaborador) {
      console.error("Colaborador não encontrado.");
      throw new Error("Colaborador não encontrado.");
  }

  const auditoriaExistente = await Auditoria.findOne({
    _id: _idAuditoria,
    criadoPor: colaborador.nome,
  }).exec();

  if (!auditoriaExistente) {
    console.error("Auditoria não encontrada ou você não tem permissão para atualizá-la.");
    throw new Error("Auditoria não encontrada ou você não tem permissão para atualizá-la.");
  }

  const qtdProdutosAtuais = auditoriaExistente.produtos?.length ?? 0;
  const remocoesCount = produtosParaRemover?.length ?? 0;
  const novosParaInserir = novosDadosProdutos?.filter((p) => !p._id) ?? [];
  
  if ((qtdProdutosAtuais - remocoesCount) + novosParaInserir.length > 100) {
    console.error("Limite de 100 produtos por auditoria atingido.");
    throw new Error("Limite de 100 produtos por auditoria atingido.");
  }

  if (novosDadosProdutos && novosDadosProdutos.length > 0) {
    for (const produto of novosDadosProdutos) {
      validarProduto(
        produto.codigo,
        produto.nome,
        produto.validade?.toString(),
        produto.quantidade
      );
    }
  }

  if (novosDadosAuditoria.nome !== undefined) {
    auditoriaExistente.nome = novosDadosAuditoria.nome;
  }

  if (produtosParaRemover && produtosParaRemover.length > 0) {
    auditoriaExistente.produtos = auditoriaExistente.produtos.filter(
      (p) => !produtosParaRemover.includes(p._id?.toString() ?? "")
    );
  }

if (novosDadosProdutos && novosDadosProdutos.length > 0) {
    for (const produto of novosDadosProdutos) {
      const { tempId, _id, isModified, ...dadosProduto } = produto as any;

      if (_id) {
        const produtoExistente = auditoriaExistente.produtos.find(
          (p) => p._id?.toString() === _id.toString()
        );

        if (produtoExistente) {
          Object.keys(dadosProduto).forEach((chave) => {
            if (dadosProduto[chave] !== undefined) {
              (produtoExistente as any)[chave] = dadosProduto[chave];
            }
          });
        }
      } else {
        auditoriaExistente.produtos.push({
          _id: new Types.ObjectId(),
          ...dadosProduto,
        } as any);
      }
    }
  }

  auditoriaExistente.markModified("produtos");

  await auditoriaExistente.save();

  return auditoriaExistente;
}

export async function buscarAuditorias(criadoPor?: string) {
    const filtro = criadoPor && criadoPor.trim() !== "" ? { criadoPor: criadoPor.trim() } : {};

    const auditoriasEncontradas = await Auditoria.find(filtro).exec();
    
    return auditoriasEncontradas;
}

export async function deletarAuditoria(_idAuditoria: string, _idColaborador: string) {

  if (!_idColaborador) {
    console.error("Não autorizado.");
    throw new Error("Não autorizado.");
  }

    const colaborador = await Colaborador.findById(_idColaborador).exec();

    if (!colaborador) {
        console.error("Colaborador não encontrado.");
        throw new Error("Colaborador não encontrado.");
    }

    if (!_idAuditoria) {
        console.error("_id da auditoria inválido.");
        throw new Error("_id da auditoria inválido.");
    }

  const auditoriaDeletada = await Auditoria.findOneAndDelete({
    _id: _idAuditoria,
    criadoPor: colaborador.nome,
  }).exec();

  if (!auditoriaDeletada) {
    console.error("Auditoria não encontrada ou você não tem permissão para excluí-la.");
    throw new Error("Auditoria não encontrada ou você não tem permissão para excluí-la.");
  }

  return auditoriaDeletada;
}
