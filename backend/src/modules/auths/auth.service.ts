import { Sessao } from "../sessoes/sessao.model";

export async function logout(sessaoId: string) {
    if (!sessaoId) throw new Error("Sessão inválida.");

    await Sessao.updateOne(
        { _id: sessaoId, revogadaEm: { $exists: false } },
        { $set: { revogadaEm: new Date() } }
    );
}