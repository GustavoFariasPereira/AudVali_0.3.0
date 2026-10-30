import jwt, {
    JwtPayload as JwtLibraryPayload
} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado.");
}

export type TipoUsuario = "colaborador" | "administrador";

export interface DadosToken {
    tipo?: TipoUsuario;
    colaboradorId?: string;
    administradorId?: string;
    sessaoId: string;
}

export interface JwtPayload extends JwtLibraryPayload, DadosToken {}

export function gerarToken(payload: DadosToken): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: "8d"
    });
}

export function verificarToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
}