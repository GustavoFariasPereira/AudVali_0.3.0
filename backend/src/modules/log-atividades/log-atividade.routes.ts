import { Router } from "express";
// ajuste o caminho para o arquivo onde estão os seus middlewares de auth
import {
    authMiddleware,
    apenasAdministrador,
    exigirSenhaAtualizada,
} from "../middlewares/authMiddleware";
import { listar } from "./log-atividade.controller";

const router = Router();

// GET /api/administradores/logs?colaboradorId=&acao=&recurso=&inicio=&fim=&pagina=&limite=
router.get("/logs", authMiddleware, apenasAdministrador, exigirSenhaAtualizada, listar);

export default router;
