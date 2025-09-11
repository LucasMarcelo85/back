import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rotas de categorias
router.get("/", categoryController.getCategories);
router.get("/id/:id", categoryController.getCategoryById);
router.get("/:slug", categoryController.getCategoryBySlug);

// Rotas protegidas - apenas para administradores
router.post("/", authenticateToken, isAdmin, categoryController.createCategory);
router.put(
	"/id/:id",
	authenticateToken,
	isAdmin,
	categoryController.updateCategory,
);
router.delete(
	"/id/:id",
	authenticateToken,
	isAdmin,
	categoryController.deleteCategory,
);

export default router;
