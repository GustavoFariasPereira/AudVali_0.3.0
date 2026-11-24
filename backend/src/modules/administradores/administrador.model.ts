import mongoose, { Document, Schema } from "mongoose";
import { meiaNoiteBrasil } from "../../utils/data";

export interface IAdministrador extends Document {
    nome: string;
    senha: string;
    senhaAtualizadaEm: Date;
}

export interface IAdiministradorResponse{
    _id?: string;
    nome: string;
    senhaAtualizadaEm: Date;
}

export interface IDashboard{
    colaboradores: number;
    colaboradoresAtivos: number;
    colaboradoresBloqueados: number;
    atividadesColaboradores: [];
    auditorias: number;
    auditoriasAtualizadas: number;
    auditoriasExcluidas: number;
}

const AdministradorSchema = new Schema<IAdministrador>({
    nome: { type: String, required: true },
    senha: { type: String, required: true, select: false },
    senhaAtualizadaEm: { type: Date, required: true, default: meiaNoiteBrasil },
}, {
    timestamps: true,
});

export const Administrador = mongoose.model<IAdministrador>("Administrador", AdministradorSchema);