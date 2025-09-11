"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController = require("../controllers/authController.js");
var authMiddleware_js_1 = require("../middleware/authMiddleware.js");
var router = express_1.default.Router();
// Rotas públicas
router.post("/login", authController.login);
// Rotas protegidas
router.get("/verify", authMiddleware_js_1.authenticateToken, authController.verifyToken);
router.get("/profile", authMiddleware_js_1.authenticateToken, authController.getProfile);
router.put("/profile", authMiddleware_js_1.authenticateToken, authController.updateProfile);
// Rota pública de registro (garantir que seja pública sem middleware de autenticação)
router.post("/register", authController.register);
exports.default = router;
