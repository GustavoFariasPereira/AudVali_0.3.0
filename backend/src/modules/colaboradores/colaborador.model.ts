import mongoose, { Schema, Document } from "mongoose";

export interface IColaborador extends Document {
    nome: string;
    email: string;
    senha: string;
    tentativas: number;
    bloqueado: boolean;
    emailVerificado: boolean;
};

const ColaboradorSchema = new Schema<IColaborador>({
    nome: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tentativas: { type: Number, required: true, default: 0},
    bloqueado: { type: Boolean, required: true, default: false },
    emailVerificado: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});

export const Colaborador = mongoose.model<IColaborador>("Colaborador", ColaboradorSchema);