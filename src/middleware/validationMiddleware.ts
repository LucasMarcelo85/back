import { Request, Response, NextFunction } from "express";

/**
 * Middleware para validar que o parâmetro ID é numérico
 */
export const validateNumericId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ message: "ID inválido: deve ser um número" });
  }

  next();
};
