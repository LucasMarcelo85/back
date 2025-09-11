import fs from "node:fs";
import path from "node:path";
import multer from "multer";
// Configuração do armazenamento para o Multer
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadPath = path.join(process.cwd(), "public", "image", "uploads");
        // Garante que o diretório existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        // Gerar um nome de arquivo único baseado na data + nome original
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${extension}`);
    },
});
// Filtro de arquivos para aceitar apenas imagens
const fileFilter = (_req, file, cb) => {
    const allowedTypes = [
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
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
});
// Controlador para upload de imagens de produtos
export const uploadProductImage = (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }
        // Construir o caminho relativo para a imagem
        const relativeFilePath = `image/uploads/${file.filename}`;
        // Responder com o caminho da imagem (incluindo a barra inicial)
        res.status(201).json({
            message: "Upload realizado com sucesso",
            imageUrl: `/${relativeFilePath}`,
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
//# sourceMappingURL=uploadController.js.map