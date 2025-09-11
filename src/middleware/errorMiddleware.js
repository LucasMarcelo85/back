"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
// Interface para erros personalizados com código HTTP
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message, statusCode) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.name = "AppError";
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
// Middleware para tratamento de erros
var errorHandler = function (err, _req, res, _next) {
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
exports.errorHandler = errorHandler;
// Middleware para lidar com rotas não encontradas
var notFoundHandler = function (req, res) {
    res.status(404).json({
        message: "Rota n\u00E3o encontrada: ".concat(req.method, " ").concat(req.originalUrl),
    });
};
exports.notFoundHandler = notFoundHandler;
