// Interface para erros personalizados com código HTTP
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}
// Middleware para tratamento de erros
export const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    // Erro personalizado da aplicação
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            error: process.env.NODE_ENV === "development" ? err : undefined,
        });
    }
    // Erro da biblioteca Prisma
    if (err.name === "PrismaClientKnownRequestError") {
        return res.status(400).json({
            message: "Erro na operação do banco de dados",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
    // Erro de validação
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Erro de validação dos dados",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
    // Erro não tratado
    res.status(500).json({
        message: "Erro interno no servidor",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
};
// Middleware para lidar com rotas não encontradas
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    });
};
//# sourceMappingURL=errorMiddleware.js.map