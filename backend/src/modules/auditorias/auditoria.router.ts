import { Router } from "express";
import { alterarAuditoria, excluirAuditoria, gerarAuditoria, listarAuditorias } from "./auditoria.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { registrarLog } from "../middlewares/logMiddleware";

const router = Router();

router.post("/criar", authMiddleware, registrarLog("criar", "auditoria"), gerarAuditoria);
router.put("/atualizar/:_idAuditoria", authMiddleware, registrarLog("atualizar", "auditoria"), alterarAuditoria);
router.get("/listar", authMiddleware, listarAuditorias);
router.delete("/deletar/:_idAuditoria", authMiddleware, registrarLog("deletar", "auditoria"), excluirAuditoria);

export default router;