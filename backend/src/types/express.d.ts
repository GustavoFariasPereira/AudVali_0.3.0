declare global {
    namespace Express {
        interface Request {
            colaboradorId?: string;
            administradorId?: string;
            tipoUsuario?: "colaborador" | "administrador";
            sessaoId?: string;
        }
    }
}

export {};