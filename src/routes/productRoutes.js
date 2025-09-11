"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productController = require("../controllers/productController.js");
var authMiddleware_js_1 = require("../middleware/authMiddleware.js");
var router = express_1.default.Router();
// Rotas de produtos
router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/category/:slug", productController.getProductsByCategory);
router.get("/id/:id", productController.getProductById);
router.get("/:slug", productController.getProductBySlug);
// Rotas protegidas - apenas para administradores
router.post("/", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, productController.createProduct);
router.put("/id/:id", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, productController.updateProduct);
router.delete("/id/:id", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, productController.deleteProduct);
exports.default = router;
