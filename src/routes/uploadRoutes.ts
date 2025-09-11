import express from "express";
import { upload, uploadProductImage } from "../controllers/uploadController.js";

const router = express.Router();

// Rota de upload de imagens de produtos (temporariamente sem autenticação para teste)
router.post(
	"/product-image",
	// authenticateToken,  // Comentado temporariamente para teste
	// isAdmin,           // Comentado temporariamente para teste
	upload.single("image"),
	uploadProductImage,
);

// Exportar como default para compatibilidade com o código existente
export default router;
