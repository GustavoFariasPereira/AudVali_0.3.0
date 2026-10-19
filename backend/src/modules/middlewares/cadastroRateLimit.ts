import rateLimit from "express-rate-limit";

export const cadastroRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        mensagem: "Muitas tentativas. Tente novamente mais tarde."
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});