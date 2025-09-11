"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticateToken = void 0;
var dotenv_1 = require("dotenv");
var jsonwebtoken_1 = require("jsonwebtoken");
dotenv_1.default.config();
// Middleware para verificar se o token JWT é válido
var authenticateToken = function (req, res, next) {
    try {
        // Verifica se a rota é de registro ou login para ignorar a verificação
        var path = req.path;
        if (path.includes("/register") || path.includes("/login")) {
            console.log("Ignorando verifica\u00E7\u00E3o de token para rota p\u00FAblica: ".concat(path));
            return next();
        }
        var authHeader = req.headers.authorization;
        var token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            return res
                .status(401)
                .json({ message: "Token de autenticação não fornecido" });
        }
        var secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET não está definido no arquivo .env");
            return res
                .status(500)
                .json({ message: "Erro de configuração no servidor" });
        }
        jsonwebtoken_1.default.verify(token, secretKey, function (err, decoded) {
            if (err) {
                console.error("Erro ao verificar token:", err.message);
                return res.status(403).json({ message: "Token inválido ou expirado" });
            }
            // Adiciona os dados do usuário decodificado ao objeto request
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        console.error("Erro no middleware de autenticação:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware para verificar se o usuário é administrador
var isAdmin = function (req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Acesso não autorizado. Requer privilégios de administrador",
        });
    }
    next();
};
exports.isAdmin = isAdmin;
