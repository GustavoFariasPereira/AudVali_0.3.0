import bcrypt from "bcrypt";
import { Colaborador } from "../colaboradores/colaborador.model";
import { criarVerificacao } from "../emails/email.service";
import { validarColaborador } from "./colaborador.validator";
import { gerarToken } from "../../utils/jwt";
import { Sessao } from "../sessoes/sessao.model";

export async function criarColaborador(
    nome: string,
    email: string,
    senha: string
) {
    validarColaborador(email, senha, nome);

    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();

    const totalUsuarios = await Colaborador.countDocuments({});

    if (totalUsuarios >= 6) {
        console.error("Limite máximo de colaboradores atingido.")
        throw new Error("Limite máximo de colaboradores atingido.");
    }

    const [nomeExistente, emailExistente] = await Promise.all([
        Colaborador.findOne({ nome: nomeNormalizado }),
        Colaborador.findOne({ email: emailNormalizado })
    ]);

    if (nomeExistente) {
        console.error("Nome já está sendo usado.")
        throw new Error("Nome já está sendo usado.");
    }

    if (emailExistente) {
        console.error("E-mail já cadastrado.");
        return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const colaborador = await Colaborador.create({
        nome: nome.trim(),
        email: emailNormalizado,
        senha: senhaHash,
        emailVerificado: false,
    });

    await criarVerificacao(emailNormalizado);

    return colaborador;
}

export async function loginColaborador(
    email: string,
    senha: string
) {
    validarColaborador(email, senha);

    const emailNormalizado = email.trim().toLowerCase();

    const colaborador = await Colaborador.findOne({
        email: emailNormalizado
    });

    if (colaborador?.bloqueado) {
        console.error(`E-mail ${emailNormalizado} está bloqueado.`);
        throw new Error("Credenciais inválidas.");
    }

    const senhaFake = "$2b$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456789"; 
    const hash = colaborador?.senha || senhaFake;
    const senhaValida = await bcrypt.compare(senha, hash);

    if (!colaborador || !senhaValida) {
        if (colaborador) {
            const colaboradorAtualizado = await Colaborador.findOneAndUpdate(
                { email: emailNormalizado },
                { $inc: { tentativas: 1 } },
                { new: true }
            );

            if (colaboradorAtualizado && colaboradorAtualizado.tentativas >= 3) {
                await Colaborador.updateOne(
                    { email: emailNormalizado },
                    { $set: { bloqueado: true } }
                );
                console.error(`E-mail ${emailNormalizado} foi bloqueado.`);
            }
        }

        console.error(`Falha de autenticação para o e-mail ${emailNormalizado}.`);
        throw new Error("Credenciais inválidas.");
    }

    if (colaborador.tentativas > 0) {
        await Colaborador.updateOne(
            { email: emailNormalizado },
            { $set: { tentativas: 0 } }
        );
    }

    await Sessao.updateMany(
        {
            colaboradorId: colaborador._id,
            revogadaEm: { $exists: false }
        },
        {
            $set: {
                revogadaEm: new Date()
            }
        }
    );

    const sessao = await Sessao.create({
        colaboradorId: colaborador._id
    });

    const token = gerarToken({
        colaboradorId: colaborador._id.toString(),
        sessaoId: sessao._id.toString()
    });

    return {
        colaborador,
        token
    };
}

export async function perfilColaborador(
    _id: string
) {
    const colaborador = await Colaborador.findById(_id)
    .select("_id nome email");

    if (!colaborador) {
        console.error("Colaborador não encontrado.");
        throw new Error("Colaborador não encontrado.");
    }

    return colaborador;
}