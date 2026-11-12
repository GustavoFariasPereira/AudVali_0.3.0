import { Router } from "express";
import { alterarSenhaADMRateLimit, cadastroADMRateLimit } from "../middlewares/admRateLimit";
import { cadastrarADM, logarADM, atualizarSenhaADM, perfilADM } from "./administrador.controller";
import { loginLimit } from "../middlewares/loginRateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/cadastrar", cadastroADMRateLimit, cadastrarADM);
router.post("/login", loginLimit, logarADM);
router.put("/alterarSenha", alterarSenhaADMRateLimit, authMiddleware, atualizarSenhaADM);
router.get("/perfil", authMiddleware, perfilADM);

export default router;