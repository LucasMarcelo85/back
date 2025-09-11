import express from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
import { validateNumericId } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Rotas para o cliente
router.post("/", authenticateToken, orderController.createOrder);
router.get("/my-orders", authenticateToken, orderController.getMyOrders);
router.get(
  "/:id",
  authenticateToken,
  validateNumericId,
  orderController.getOrderById
);
router.get(
  "/number/:orderNumber",
  authenticateToken,
  orderController.getOrderByNumber
);
router.put(
  "/:id/cancel",
  authenticateToken,
  validateNumericId,
  orderController.cancelOrder
);

// Rotas administrativas
router.get("/", authenticateToken, isAdmin, orderController.getAllOrders);
router.put(
  "/:id/status",
  authenticateToken,
  isAdmin,
  validateNumericId,
  orderController.updateOrderStatus
);
router.put(
  "/:id/notes",
  authenticateToken,
  isAdmin,
  validateNumericId,
  orderController.updateOrderNotes
);
router.put(
  "/:id/payment-method",
  authenticateToken,
  isAdmin,
  validateNumericId,
  orderController.updateOrderPaymentMethod
);
router.put(
  "/:id/tracking",
  authenticateToken,
  isAdmin,
  validateNumericId,
  orderController.updateTrackingNumber
);

export default router;
