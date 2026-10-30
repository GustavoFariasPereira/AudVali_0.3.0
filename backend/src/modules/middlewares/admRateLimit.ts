import rateLimit from "express-rate-limit";

export const cadastroADMRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        mensagem: "Muitas tentativas. Tente novamente mais tarde."
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});

export const alterarSenhaADMRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        mensagem: "Muitas solicitações. Tente novamente mais tarde."
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});