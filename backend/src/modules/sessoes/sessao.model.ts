import mongoose, { Document, Schema } from "mongoose";

export type TipoUsuario = "colaborador" | "administrador";

export interface ISessao extends Document {
    tipo: TipoUsuario;
    colaboradorId?: mongoose.Types.ObjectId;
    administradorId?: mongoose.Types.ObjectId;
    criadoEm: Date;
    revogadaEm?: Date;
}

const sessaoSchema = new Schema<ISessao>({
    tipo: {
        type: String,
        enum: ["colaborador", "administrador"],
        default: "colaborador",
        required: true
    },
    colaboradorId: {
        type: Schema.Types.ObjectId,
        ref: "Colaborador",
        required: function (this: ISessao) {
            return this.tipo === "colaborador";
        }
    },
    administradorId: {
        type: Schema.Types.ObjectId,
        ref: "Administrador",
        required: function (this: ISessao) {
            return this.tipo === "administrador";
        }
    },
    criadoEm: { type: Date, default: Date.now, required: true },
    revogadaEm: { type: Date }
});

export const Sessao = mongoose.model<ISessao>("Sessao", sessaoSchema);