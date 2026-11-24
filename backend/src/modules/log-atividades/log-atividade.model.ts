import mongoose, { Document, Schema } from "mongoose";

export const ACOES_LOG = [
    "login",
    "logout",
    "criar",
    "atualizar",
    "deletar",
    "exportar",
    "trocar_senha",
] as const;

export type AcaoLog = (typeof ACOES_LOG)[number];

export const RECURSOS_LOG = ["colaborador", "auditoria"] as const;

export type RecursoLog = (typeof RECURSOS_LOG)[number];

export interface ILogAtividade extends Document {
    colaboradorId: mongoose.Types.ObjectId;
    sessaoId?: mongoose.Types.ObjectId;
    acao: AcaoLog;
    recurso?: RecursoLog;
    recursoId?: mongoose.Types.ObjectId;
    detalhes?: Record<string, unknown>;
    ip?: string;
    sucesso: boolean;
    criadoEm: Date;
}

const logAtividadeSchema = new Schema<ILogAtividade>({
    colaboradorId: { type: Schema.Types.ObjectId, ref: "Colaborador", required: true },
    sessaoId: { type: Schema.Types.ObjectId },
    acao: { type: String, enum: ACOES_LOG, required: true },
    recurso: { type: String, enum: RECURSOS_LOG },
    recursoId: { type: Schema.Types.ObjectId },
    detalhes: { type: Schema.Types.Mixed },
    ip: { type: String },
    sucesso: { type: Boolean, required: true },
    criadoEm: { type: Date, default: Date.now, required: true },
});

// histórico de um colaborador (mais recentes primeiro)
logAtividadeSchema.index({ colaboradorId: 1, criadoEm: -1 });
// contagens por ação e período (dashboard)
logAtividadeSchema.index({ acao: 1, criadoEm: -1 });
// relatórios por recurso e ação
logAtividadeSchema.index({ recurso: 1, acao: 1, criadoEm: -1 });

// Retenção automática (LGPD): descomente para apagar logs com mais de 12 meses.
// Ajuste o prazo conforme a exigência do seu negócio.
// logAtividadeSchema.index({ criadoEm: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });

export const LogAtividade = mongoose.model<ILogAtividade>("LogAtividade", logAtividadeSchema);