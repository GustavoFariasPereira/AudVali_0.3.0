import { Router } from "express";
import { cadastrarColaborador, logarColaborador, perfil } from "./colaborador.controller";
import { cadastroRateLimit } from "../middlewares/cadastroRateLimit";
import { loginLimit } from "../middlewares/loginRateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/cadastrar", cadastroRateLimit, cadastrarColaborador);
router.post("/logar", loginLimit, logarColaborador);
router.get("/perfil", authMiddleware, perfil );

export default router;