import rateLimit from "express-rate-limit";

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        mensagem: "Muitas tentativas de login a partir deste IP. Tente novamente em 15 minutos."
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});