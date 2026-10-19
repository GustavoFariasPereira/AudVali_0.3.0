import jwt, {
    JwtPayload as JwtLibraryPayload
} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado.");
}

export interface JwtPayload extends JwtLibraryPayload {
    colaboradorId: string;
    sessaoId: string;
}

export function gerarToken(payload: {
    colaboradorId: string;
    sessaoId: string;
}): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: "8d"
    });
}

export function verificarToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
}