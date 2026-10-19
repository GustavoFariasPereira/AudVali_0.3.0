import mongoose, { Document, Schema } from "mongoose";

export interface IEmail extends Document {
    email: string;
    codigoHash: string;
    expiraEm: Date;
    tentativas: number;
    createdAt: Date;
    updatedAt: Date;
};

const EmailSchema = new Schema<IEmail>({
    email: { type: String, required: true, lowercase: true, trim: true },
    codigoHash: {type: String, required: true},
    expiraEm: {type: Date, required: true},
    tentativas: {type: Number, required: true, default: 0},
},{
    timestamps: true,
});

EmailSchema.index(
    { expiraEm: 1 },
    { expireAfterSeconds: 0 }
);

export const Email = mongoose.model<IEmail>("Email", EmailSchema);