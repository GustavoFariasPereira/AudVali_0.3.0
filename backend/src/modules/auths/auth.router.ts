import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { logoutController } from "./auth.controller";

const router = Router();

router.post("/logout", authMiddleware, logoutController);

export default router;