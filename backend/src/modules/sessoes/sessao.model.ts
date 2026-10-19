import mongoose, { Document, Schema } from "mongoose";

export interface ISessao extends Document {
    colaboradorId: mongoose.Types.ObjectId;
    criadoEm: Date;
    revogadaEm?: Date;
}

const sessaoSchema = new Schema<ISessao>({
    colaboradorId: {
        type: Schema.Types.ObjectId,
        ref: "Colaborador",
        required: true
    },

    criadoEm: {
        type: Date,
        default: Date.now,
        required: true
    },

    revogadaEm: {
        type: Date
    }
});

export const Sessao = mongoose.model<ISessao>(
    "Sessao",
    sessaoSchema
);