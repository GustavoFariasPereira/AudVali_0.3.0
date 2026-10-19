import { Router } from "express";
import { alterarAuditoria, excluirAuditoria, gerarAuditoria, listarAuditorias } from "./auditoria.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/criar", authMiddleware, gerarAuditoria);
router.put("/atualizar/:_idAuditoria", authMiddleware, alterarAuditoria);
router.get("/listar", authMiddleware, listarAuditorias);
router.delete("/deletar/:_idAuditoria", authMiddleware, excluirAuditoria);

export default router;