declare global {
    namespace Express {
        interface Request {
            colaboradorId?: string;
            sessaoId?: string;
        }
    }
}

export {};