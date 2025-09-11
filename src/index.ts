import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Configuração de ambiente
dotenv.config();
const PORT = process.env.PORT || 3000;
// Inicializar o PrismaClient se necessário em cada controlador

// Inicialização do Express
const app = express();

// Corrigir proxy para produção (NGINX/EasyPanel)
const trustProxy =
  process.env.TRUST_PROXY === "1" || process.env.NODE_ENV === "production";
app.set("trust proxy", trustProxy);

// Configuração de CORS mais robusta
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições de todos os domínios em desenvolvimento
      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
        return;
      }

      // Domínios permitidos em produção
      const allowedOrigins = [
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
      } else {
        callback(new Error("Bloqueado por CORS"));
      }
    },

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Middleware padrão
app.use(express.json());

// Middleware de limitação de taxa (desativado temporariamente para depuração)
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";

// Desativar rate limiter temporariamente para depurar problemas de autenticação
// app.use("/api", apiLimiter);

// Importar middleware de logging avançado
import { httpLogger } from "./middleware/loggingMiddleware.js";
import Logger from "./utils/logger.js";

// Middleware para logging avançado
app.use(httpLogger);

// Log de inicialização do servidor
Logger.info("Servidor inicializado");

// Configurar Swagger para documentação da API
import { setupSwagger } from "./utils/swagger.js";

setupSwagger(app);

// Rotas
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);

// Servir arquivos estáticos da pasta public
app.use(express.static("public"));

// Rota para verificação de status
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Importar middlewares de tratamento de erros
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

// Middleware para tratamento de rotas não encontradas - deve vir após todas as rotas
app.use(notFoundHandler);

// Middleware para tratamento de erros - deve ser o último middleware
app.use(errorHandler);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app;
