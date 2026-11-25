import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { logoutController } from "./auth.controller";
import { registrarLog } from "../middlewares/logMiddleware";

const router = Router();

router.post("/logout", authMiddleware, registrarLog("logout", "colaborador"), logoutController);

export default router;