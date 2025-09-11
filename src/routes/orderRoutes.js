"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var orderController = require("../controllers/orderController.js");
var authMiddleware_js_1 = require("../middleware/authMiddleware.js");
var validationMiddleware_js_1 = require("../middleware/validationMiddleware.js");
var router = express_1.default.Router();
// Rotas para o cliente
router.post("/", authMiddleware_js_1.authenticateToken, orderController.createOrder);
router.get("/my-orders", authMiddleware_js_1.authenticateToken, orderController.getMyOrders);
router.get("/:id", authMiddleware_js_1.authenticateToken, validationMiddleware_js_1.validateNumericId, orderController.getOrderById);
router.get("/number/:orderNumber", authMiddleware_js_1.authenticateToken, orderController.getOrderByNumber);
router.put("/:id/cancel", authMiddleware_js_1.authenticateToken, validationMiddleware_js_1.validateNumericId, orderController.cancelOrder);
// Rotas administrativas
router.get("/", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, orderController.getAllOrders);
router.put("/:id/status", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, validationMiddleware_js_1.validateNumericId, orderController.updateOrderStatus);
router.put("/:id/notes", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, validationMiddleware_js_1.validateNumericId, orderController.updateOrderNotes);
router.put("/:id/payment-method", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, validationMiddleware_js_1.validateNumericId, orderController.updateOrderPaymentMethod);
router.put("/:id/tracking", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, validationMiddleware_js_1.validateNumericId, orderController.updateTrackingNumber);
exports.default = router;
