"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumericId = void 0;
/**
 * Middleware para validar que o parâmetro ID é numérico
 */
var validateNumericId = function (req, res, next) {
    var id = req.params.id;
    if (!id || !/^\d+$/.test(id)) {
        return res.status(400).json({ message: "ID inválido: deve ser um número" });
    }
    next();
};
exports.validateNumericId = validateNumericId;
