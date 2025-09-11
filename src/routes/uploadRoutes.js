"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uploadController_js_1 = require("../controllers/uploadController.js");
var router = express_1.default.Router();
// Rota de upload de imagens de produtos (temporariamente sem autenticação para teste)
router.post("/product-image", 
// authenticateToken,  // Comentado temporariamente para teste
// isAdmin,           // Comentado temporariamente para teste
uploadController_js_1.upload.single("image"), uploadController_js_1.uploadProductImage);
// Exportar como default para compatibilidade com o código existente
exports.default = router;
