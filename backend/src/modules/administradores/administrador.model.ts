import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdministrador extends Document{
    nome: string;
    senha: string;
    senhaAtualizadaEm: Date;
}

export interface IAdiministradorResponse{
    _id?: string;
    nome: string;
    senhaAtualizadaEm: Date;
}

export interface IAdministradorModel extends Model<IAdministrador> {
  alterarSenha(adminId: string, novaSenhaPura: string): Promise<IAdministrador | null>;
}

const AdministradorSchema = new Schema<IAdministrador>({
    nome: { type: String, required: true },
    senha: { type: String, required: true },
    senhaAtualizadaEm: { type: Date, required: true, default: () => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const dataBrasilStr = formatter.format(new Date());
    
    return new Date(`${dataBrasilStr}T00:00:00.000-03:00`);
  } }
}, {
    timestamps: true,
});

AdministradorSchema.statics.alterarSenha = async function(adminId, novaSenhaPura) {
    const saltRounds = 10;
    
    const novoHashSenha = await bcrypt.hash(novaSenhaPura, saltRounds);

    const administradorAtualizado = await this.findByIdAndUpdate(
        adminId,
        {
            senha: novoHashSenha,
            senhaAtualizadaEm: () => {
                const formatter = new Intl.DateTimeFormat('en-CA', {
                    timeZone: 'America/Sao_Paulo',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                
                const dataBrasilStr = formatter.format(new Date());
                
                return new Date(`${dataBrasilStr}T00:00:00.000-03:00`);
            } 
        },
        { new: true }
    ).exec();

    if (!administradorAtualizado) {
        console.error("Administrador não encontrado.");
        throw new Error("Administrador não encontrado.");
    }

    return administradorAtualizado;
};

export const Administrador = mongoose.model<IAdministrador, IAdministradorModel>("Administrador", AdministradorSchema);