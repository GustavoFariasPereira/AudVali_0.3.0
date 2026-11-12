import bcrypt from "bcrypt";
import { gerarToken } from "../../utils/jwt";
import { Sessao } from "../sessoes/sessao.model";
import { Administrador, IAdiministradorResponse, IAdministrador } from "./administrador.model";
import { validarAdministrador } from "./administrador.validator";
import { meiaNoiteBrasil } from "../../utils/data";

export async function criarADM(
    administrador: IAdministrador
) {
    validarAdministrador(administrador.senha, administrador.nome);

    const temAdministrador = await Administrador.countDocuments({}).exec();

    if(temAdministrador > 0){
        console.error("Já existe um administrador cadastrado.");
        throw new Error("Já existe um administrador cadastrado.");
    }

    const senhaHash = await bcrypt.hash(administrador.senha, 12);

    return Administrador.create({
            nome: administrador.nome,
            senha: senhaHash,
        }
    )
}

export async function loginADM(
    nome: string,
    senha: string
) {
    validarAdministrador(undefined, nome);

    const administrador = await Administrador.findOne({nome: nome}).select("+senha");

    const senhaFake = "$2b$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456789"; 
    const hash = administrador?.senha || senhaFake;
    const senhaValida = await bcrypt.compare(senha, hash);

    if (!administrador || !senhaValida) {
        console.error("Credenciais inválidas.");
        throw new Error("Credenciais inválidas.");
    }

    await Sessao.updateMany(
        {
            administradorId: administrador._id,
            revogadaEm: { $exists: false }
        },
        {
            $set: {
                revogadaEm: new Date()
            }
        }
    );

    const sessao = await Sessao.create({
        tipo: "administrador",
        administradorId: administrador._id
    });

    const token = gerarToken({
        tipo: "administrador",
        administradorId: String(administrador._id),
        sessaoId: String(sessao._id)
    });

    const administradorResponse: IAdiministradorResponse = {
        _id: administrador._id.toString(),
        nome: administrador.nome,
        senhaAtualizadaEm: administrador.senhaAtualizadaEm
    }

    return {
        administradorResponse,
        token
    };
}

export const DIAS_VALIDADE_SENHA = 30;

export function senhaExpirada(senhaAlteradaEm: Date): boolean {
    const limite = DIAS_VALIDADE_SENHA * 24 * 60 * 60 * 1000;
    return Date.now() - senhaAlteradaEm.getTime() >= limite;
}

export async function trocarSenhaADM(
    administradorId: string,
    sessaoId: string,
    senhaAtual: string,
    novaSenha: string
) {
    if (!administradorId || !sessaoId) throw new Error("Sessão inválida.");
    
    if (!senhaAtual) throw new Error("Informe a senha atual.");
    
    validarAdministrador(novaSenha);
    const admin = await Administrador.findById(administradorId).select("+senha");
    if (!admin || !(await bcrypt.compare(senhaAtual, admin.senha))) {
        console.error("Senha atual incorreta.");
        throw new Error("Senha atual incorreta.");
    }

    if (await bcrypt.compare(novaSenha, admin.senha)) {
        console.error("A nova senha deve ser diferente da atual.");
        throw new Error("A nova senha deve ser diferente da atual.");
    }

    admin.senha = await bcrypt.hash(novaSenha, 12);
    admin.senhaAtualizadaEm = meiaNoiteBrasil();
    await admin.save();

    await Sessao.updateMany(
        {
            administradorId: admin._id,
            _id: { $ne: sessaoId },
            revogadaEm: { $exists: false }
        },
        { $set: { revogadaEm: new Date() } }
    );
}

export async function buscarPerfilADM(
    _id: string
) {
    const administrador = await Administrador.findById(_id)
    .select("_id nome senhaAtualizadaEm");

    if (!administrador) {
        console.error("Administrador não encontrado.");
        throw new Error("Administrador não encontrado.");
    }

    return administrador;
}