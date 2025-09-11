/**
 * Middleware para validar que o parâmetro ID é numérico
 */
export const validateNumericId = (req, res, next) => {
    const { id } = req.params;
    if (!id || !/^\d+$/.test(id)) {
        return res.status(400).json({ message: "ID inválido: deve ser um número" });
    }
    next();
};
//# sourceMappingURL=validationMiddleware.js.map