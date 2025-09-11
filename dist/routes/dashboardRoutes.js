import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
// Rota para estatísticas do dashboard (apenas para administradores)
router.get("/stats", authenticateToken, isAdmin, dashboardController.getDashboardStats);
export default router;
//# sourceMappingURL=dashboardRoutes.js.map