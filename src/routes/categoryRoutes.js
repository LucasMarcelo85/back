"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var categoryController = require("../controllers/categoryController.js");
var authMiddleware_js_1 = require("../middleware/authMiddleware.js");
var router = express_1.default.Router();
// Rotas de categorias
router.get("/", categoryController.getCategories);
router.get("/id/:id", categoryController.getCategoryById);
router.get("/:slug", categoryController.getCategoryBySlug);
// Rotas protegidas - apenas para administradores
router.post("/", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, categoryController.createCategory);
router.put("/id/:id", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, categoryController.updateCategory);
router.delete("/id/:id", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, categoryController.deleteCategory);
exports.default = router;
