import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

// Taxa de requisições padrão a partir da variável de ambiente ou 100 por minuto
const maxRequestsPerMinute = process.env.RATE_LIMIT
  ? parseInt(process.env.RATE_LIMIT, 10)
  : 100;

// Configuração do limitador de taxa
export const apiLimiter = rateLimit({
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
  skip: (req: Request, _res: Response) => {
    // Se o usuário estiver autenticado e for um administrador, não aplica limite
    if (req.user && req.user.role === "ADMIN") {
      return true;
    }
    return false;
  },
});
