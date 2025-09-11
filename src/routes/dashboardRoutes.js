"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dashboardController = require("../controllers/dashboardController.js");
var authMiddleware_js_1 = require("../middleware/authMiddleware.js");
var router = express_1.default.Router();
// Rota para estatísticas do dashboard (apenas para administradores)
router.get("/stats", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, dashboardController.getDashboardStats);
exports.default = router;
