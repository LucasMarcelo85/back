import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rotas públicas
router.post("/login", authController.login);

// Rotas protegidas
router.get("/verify", authenticateToken, authController.verifyToken);
router.get("/profile", authenticateToken, authController.getProfile);
router.put("/profile", authenticateToken, authController.updateProfile);

// Rota pública de registro (garantir que seja pública sem middleware de autenticação)
router.post("/register", authController.register);

export default router;
