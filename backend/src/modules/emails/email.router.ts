import { Router } from "express";
import { confirmacaoEmailRateLimit, reenvioCodigoRateLimit } from "../middlewares/emailRateLimit";
import { confirmarEmailController, reenviarCodigoController } from "./email.controller";

const router = Router();

router.post("/confirmar-email", confirmacaoEmailRateLimit, confirmarEmailController);

router.post("/reenviar-codigo", reenvioCodigoRateLimit, reenviarCodigoController);

export default router;