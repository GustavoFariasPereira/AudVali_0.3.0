import mongoose, { Schema, Document } from "mongoose";
import { IProduto } from "../produtos/produto.model";

export interface IAuditoria extends Document{
    nome: string,
    produtos: IProduto[],
    criadoPor: string
}

const AuditoriaSchema = new Schema<IAuditoria>({
    nome: {type: String, required: true},
    produtos: {type: [{
            codigo: Number,
            nome: String,
            validade: Date,
            quantidade: Number,
        }], required: true},
    criadoPor: {type: String, required: true},
},{
    timestamps: true,
});

export const Auditoria = mongoose.model<IAuditoria>("Auditoria", AuditoriaSchema);