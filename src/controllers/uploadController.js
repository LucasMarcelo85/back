"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = exports.upload = void 0;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var multer_1 = require("multer");
// Configuração do armazenamento para o Multer
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        var uploadPath = node_path_1.default.join(process.cwd(), "public", "image", "uploads");
        // Garante que o diretório existe
        if (!node_fs_1.default.existsSync(uploadPath)) {
            node_fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        // Gerar um nome de arquivo único baseado na data + nome original
        var uniqueSuffix = "".concat(Date.now(), "-").concat(Math.round(Math.random() * 1e9));
        var extension = node_path_1.default.extname(file.originalname);
        cb(null, "product-".concat(uniqueSuffix).concat(extension));
    },
});
// Filtro de arquivos para aceitar apenas imagens
var fileFilter = function (_req, file, cb) {
    var allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
        // cb(new Error("Tipo de arquivo não suportado. Apenas JPEG, PNG, GIF e WebP são permitidos."));
    }
};
// Configuração do Multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
});
// Controlador para upload de imagens de produtos
var uploadProductImage = function (req, res) {
    try {
        var file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }
        // Construir o caminho relativo para a imagem
        var relativeFilePath = "image/uploads/".concat(file.filename);
        // Responder com o caminho da imagem (incluindo a barra inicial)
        res.status(201).json({
            message: "Upload realizado com sucesso",
            imageUrl: "/".concat(relativeFilePath),
            originalName: file.originalname,
            size: file.size,
        });
    }
    catch (error) {
        console.error("Erro no upload de imagem:", error);
        res.status(500).json({
            message: "Erro ao processar o upload da imagem",
            error: error.message,
        });
    }
};
exports.uploadProductImage = uploadProductImage;
