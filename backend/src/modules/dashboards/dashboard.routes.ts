import { Router } from "express";
// ajuste o caminho para o arquivo onde estão os seus middlewares de auth
import {
    authMiddleware,
    apenasAdministrador,
    exigirSenhaAtualizada,
} from "../middlewares/authMiddleware";
import { dashboard } from "./dashboard.controller";

const router = Router();

// GET /api/administradores/dashboard?inicio=&fim=
router.get("/dashboard", authMiddleware, apenasAdministrador, exigirSenhaAtualizada, dashboard);

export default router;