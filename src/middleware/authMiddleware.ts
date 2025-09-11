import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

// Interface para o payload do JWT
interface UserJwtPayload extends jwt.JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Estendendo a interface Request do Express para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// Middleware para verificar se o token JWT é válido
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verifica se a rota é de registro ou login para ignorar a verificação
    const path = req.path;
    if (path.includes("/register") || path.includes("/login")) {
      console.log(`Ignorando verificação de token para rota pública: ${path}`);
      return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token de autenticação não fornecido" });
    }

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      console.error("JWT_SECRET não está definido no arquivo .env");
      return res
        .status(500)
        .json({ message: "Erro de configuração no servidor" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Erro ao verificar token:", err.message);
        return res.status(403).json({ message: "Token inválido ou expirado" });
      }

      // Adiciona os dados do usuário decodificado ao objeto request
      req.user = decoded as UserJwtPayload;
      next();
    });
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Middleware para verificar se o usuário é administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
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
