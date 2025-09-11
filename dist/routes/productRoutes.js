import express from "express";
import * as productController from "../controllers/productController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
// Rotas de produtos
router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/category/:slug", productController.getProductsByCategory);
router.get("/id/:id", productController.getProductById);
router.get("/:slug", productController.getProductBySlug);
// Rotas protegidas - apenas para administradores
router.post("/", authenticateToken, isAdmin, productController.createProduct);
router.put("/id/:id", authenticateToken, isAdmin, productController.updateProduct);
router.delete("/id/:id", authenticateToken, isAdmin, productController.deleteProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map