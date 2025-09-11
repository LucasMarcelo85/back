"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = void 0;
var express_rate_limit_1 = require("express-rate-limit");
// Taxa de requisições padrão a partir da variável de ambiente ou 100 por minuto
var maxRequestsPerMinute = process.env.RATE_LIMIT
    ? parseInt(process.env.RATE_LIMIT, 10)
    : 100;
// Configuração do limitador de taxa
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minuto
    limit: maxRequestsPerMinute,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Muitas requisições, por favor tente novamente mais tarde",
    },
    // A biblioteca express-rate-limit usa a configuração 'trust proxy' do Express
    // Permitir mais requisições para usuários autenticados
    skip: function (req, _res) {
        // Se o usuário estiver autenticado e for um administrador, não aplica limite
        if (req.user && req.user.role === "ADMIN") {
            return true;
        }
        return false;
    },
});
