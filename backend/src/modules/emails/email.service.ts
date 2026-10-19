import { Resend } from "resend";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { Email } from "../emails/email.model";
import { Colaborador } from "../colaboradores/colaborador.model";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailConfirmacao(
    email: string,
    codigo: string
) {
    const emailNormalizado = email.trim().toLowerCase();
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [emailNormalizado],
        subject: "Confirmação de e-mail",
        html: `
            <h1>Confirmação de e-mail</h1>

            <p>Seu código de confirmação é:</p>

            <h2>${codigo}</h2>

            <p>Esse código será utilizado para confirmar seu endereço de e-mail.</p>
        `,
    });

    if (error) {
        console.error("Erro ao enviar e-mail de confirmação:", error.message)
        throw new Error("Erro ao enviar e-mail");
    }

    return data;
}

function gerarCodigo(): string {
    return crypto.randomInt(100000, 1000000).toString();
}

export async function criarVerificacao(email: string) {

    const emailNormalizado = email.trim().toLowerCase();

    const verificacaoExistente = await Email.findOne({
        email: emailNormalizado
    });

    if (verificacaoExistente) {

        const umMinuto = 60 * 1000;

        const passouUmMinuto =
            Date.now() - verificacaoExistente.createdAt.getTime()
            >= umMinuto;

        if (!passouUmMinuto) {
            console.error("Aguarde um minuto antes de solicitar um novo código");
            throw new Error( "Aguarde um minuto antes de solicitar um novo código");
        }

        await Email.deleteOne({
            _id: verificacaoExistente._id
        });
    }

    const codigo = gerarCodigo();

    const codigoHash = await bcrypt.hash(codigo, 10);

    const expiraEm = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await Email.create({
        email: emailNormalizado,
        codigoHash,
        expiraEm,
        tentativas: 0,
    });

    await enviarEmailConfirmacao(
        emailNormalizado,
        codigo
    );
}

export async function confirmarEmail(
    email: string,
    codigo: string
) {

    const emailNormalizado = email.trim().toLowerCase();

    const verificacaoExistente =
        await Email.findOne({
            email: emailNormalizado
        });

    if (!verificacaoExistente) {
        console.error("Não existe verificação para esse e-mail.");
        return;
    }

    if (verificacaoExistente.expiraEm < new Date()) {

        await Email.deleteOne({
            _id: verificacaoExistente._id
        });
        
        console.error("Código expirado.");
        throw new Error("Código expirado.");
    }

    if (verificacaoExistente.tentativas >= 5) {
        console.error("Número máximo de tentativas atingido.");
        throw new Error("Número máximo de tentativas atingido.");
    }

    const codigoValido = await bcrypt.compare(
        codigo,
        verificacaoExistente.codigoHash
    );

    if (!codigoValido) {

        await Email.updateOne(
            { _id: verificacaoExistente._id },
            {
                $inc: {
                    tentativas: 1
                }
            }
        );

        console.error("Código inválido.");
        throw new Error("Código inválido.");
    }

    const resultado = await Colaborador.updateOne(
        { email: emailNormalizado },
        {
            $set: {
                emailVerificado: true
            }
        }
    );

    if (resultado.matchedCount === 0) {
        console.error("Não foi possível confirmar o e-mail.");
        throw new Error("Não foi possível confirmar o e-mail.");
    }

    await Email.deleteOne({
        _id: verificacaoExistente._id
    });
}