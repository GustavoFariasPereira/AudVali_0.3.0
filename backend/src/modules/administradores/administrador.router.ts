import { Router } from "express";
import { alterarSenhaADMRateLimit, cadastroADMRateLimit } from "../middlewares/admRateLimit";
import { cadastrarADM, logarADM, atualizarSenhaADM } from "./administrador.controller";
import { loginLimit } from "../middlewares/loginRateLimit";

const router = Router();

router.post("/cadastrar", cadastroADMRateLimit, cadastrarADM);
router.post("/login", loginLimit, logarADM);
router.put("/alterarSenha", alterarSenhaADMRateLimit, atualizarSenhaADM);

export default router;