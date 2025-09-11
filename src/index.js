"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var cors_1 = require("cors");
var authRoutes_js_1 = require("./routes/authRoutes.js");
var categoryRoutes_js_1 = require("./routes/categoryRoutes.js");
var dashboardRoutes_js_1 = require("./routes/dashboardRoutes.js");
var orderRoutes_js_1 = require("./routes/orderRoutes.js");
var productRoutes_js_1 = require("./routes/productRoutes.js");
var uploadRoutes_js_1 = require("./routes/uploadRoutes.js");
// Configuração de ambiente
dotenv_1.default.config();
var PORT = process.env.PORT || 3000;
// Inicializar o PrismaClient se necessário em cada controlador
// Inicialização do Express
var app = (0, express_1.default)();
// Corrigir proxy para produção (NGINX/EasyPanel)
var trustProxy = process.env.TRUST_PROXY === "1" || process.env.NODE_ENV === "production";
app.set("trust proxy", trustProxy);
// Configuração de CORS mais robusta
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Permite requisições de todos os domínios em desenvolvimento
        if (process.env.NODE_ENV !== "production") {
            callback(null, true);
            return;
        }
        // Domínios permitidos em produção
        var allowedOrigins = [
            "https://loja.closetmodafitness.com",
            "http://localhost:5173",
            "http://localhost:3000",
        ];
        // Permitir requisições sem origem (ex: aplicações nativas)
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Bloqueado por CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
// Middleware padrão
app.use(express_1.default.json());
// Desativar rate limiter temporariamente para depurar problemas de autenticação
// app.use("/api", apiLimiter);
// Importar middleware de logging avançado
var loggingMiddleware_js_1 = require("./middleware/loggingMiddleware.js");
var logger_js_1 = require("./utils/logger.js");
// Middleware para logging avançado
app.use(loggingMiddleware_js_1.httpLogger);
// Log de inicialização do servidor
logger_js_1.default.info("Servidor inicializado");
// Configurar Swagger para documentação da API
var swagger_js_1 = require("./utils/swagger.js");
(0, swagger_js_1.setupSwagger)(app);
// Rotas
app.use("/api/products", productRoutes_js_1.default);
app.use("/api/categories", categoryRoutes_js_1.default);
app.use("/api/auth", authRoutes_js_1.default);
app.use("/api/upload", uploadRoutes_js_1.default);
app.use("/api/dashboard", dashboardRoutes_js_1.default);
app.use("/api/orders", orderRoutes_js_1.default);
// Servir arquivos estáticos da pasta public
app.use(express_1.default.static("public"));
// Rota para verificação de status
app.get("/api/health", function (_req, res) {
    res.json({ status: "ok", timestamp: new Date() });
});
// Importar middlewares de tratamento de erros
var errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
// Middleware para tratamento de rotas não encontradas - deve vir após todas as rotas
app.use(errorMiddleware_js_1.notFoundHandler);
// Middleware para tratamento de erros - deve ser o último middleware
app.use(errorMiddleware_js_1.errorHandler);
// Inicialização do servidor
app.listen(PORT, function () {
    console.log("Servidor rodando na porta ".concat(PORT));
});
// Tratamento de erros não capturados
process.on("unhandledRejection", function (reason, promise) {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", function (error) {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
exports.default = app;
